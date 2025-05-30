"use client";

import { useDeSoApi } from '@/api/useDeSoApi';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import { useState, useRef, memo, useCallback } from 'react'; // Import memo and useCallback

import { MarkdownText } from '@/components/MarkdownText';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { PostStats } from './PostStats';

import { queryKeys, uiKeys } from '@/queries';
import styles from './Post.module.css';

const COMMENT_LIMIT = 10;

// Original component function
const PostComponent = ({ post, username, userProfile, isQuote, isComment }) => {
  if (!post) return null;

  const {
    PostHashHex,
    Body,
    ImageURLs,
    CommentCount,
    RepostedPostEntryResponse,
    PosterPublicKeyBase58Check,
    ProfileEntryResponse,
  } = post;

  const { getSinglePost } = useDeSoApi();
  const queryClient = useQueryClient();

  const shouldFetchFirstPage = useRef(false);

  const [showRaw, setShowRaw] = useState(() => {
    return queryClient.getQueryData(uiKeys.rawVisible(PostHashHex)) ?? false;
  });  

  const rawUsername =
    username || ProfileEntryResponse?.Username || PosterPublicKeyBase58Check || 'Unknown';

  const isPublicKey = isMaybePublicKey(rawUsername);
  const lookupKey = !isPublicKey && rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;
  const displayName = ProfileEntryResponse?.ExtraData?.DisplayName || userProfile?.ExtraData?.DisplayName;

  const [showReplies, setShowReplies] = useState(() => {
    return queryClient.getQueryData(uiKeys.commentsVisible(PostHashHex)) ?? false;
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.postComments(PostHashHex),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getSinglePost({
        PostHashHex,
        CommentOffset: pageParam,
        CommentLimit: COMMENT_LIMIT,
      });

      if (!response.success) throw new Error(response.error || 'Failed to fetch comments');

      const newComments = response.data?.PostFound?.Comments || [];

      const existing = queryClient.getQueryData(queryKeys.postComments(PostHashHex));
      const existingHashes = new Set(
        existing?.pages.flatMap(p => p.comments.map(c => c.PostHashHex)) || []
      );

      const filteredComments = newComments.filter(
        (c) => !existingHashes.has(c.PostHashHex)
      );

      return {
        comments: filteredComments,
        nextOffset: pageParam + COMMENT_LIMIT,
        hasMore: newComments.length === COMMENT_LIMIT,
      };
    }, 
    getNextPageParam: (lastPage, pages) => {
      // Count both local comments and promoted comments (originally local)
      const localAndPromotedCount = pages[0]?.comments?.filter(c => c.isLocal || c.isPromoted)?.length || 0;
      const totalLoaded = pages.flatMap(p => p.comments).length - localAndPromotedCount;
      return lastPage.hasMore ? totalLoaded : undefined;
    },    
    enabled: showReplies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];


  const newCommentsVisible = queryClient.getQueryData(uiKeys.newCommentsVisible(PostHashHex)) ?? true;

  const handleReplyCallback = useCallback((newReply) => {
    if (!showReplies) {
      shouldFetchFirstPage.current = true; // mark that we need to fetch backend later
    }

    const commentWithFlag = { ...newReply, isLocal: true };

    queryClient.setQueryData(queryKeys.postComments(PostHashHex), (oldData) => {
      if (!oldData) {
        return {
          pages: [{ comments: [commentWithFlag] }],
          pageParams: [null],
        };
      }

      const exists = oldData.pages.some(page =>
        page.comments.some(c => c.PostHashHex === commentWithFlag.PostHashHex)
      );
      if (exists) return oldData;

      const firstPage = oldData.pages[0];
      return {
        ...oldData,
        pages: [
          {
            ...firstPage,
            comments: [commentWithFlag, ...firstPage.comments],
          },
          ...oldData.pages.slice(1),
        ],
      };
    });
  }, [queryClient, PostHashHex, showReplies]);

  const injectedComments = newCommentsVisible
    ? data?.pages?.[0]?.comments?.filter(c => c.isLocal) || []
    : [];  

    
  const toggleReplies = () => {
    const newVisible = !showReplies;

    queryClient.setQueryData(uiKeys.commentsVisible(PostHashHex), newVisible);
    // Only set newCommentsVisible to false when showing replies, keep it true when hiding
    if (newVisible) {
      queryClient.setQueryData(uiKeys.newCommentsVisible(PostHashHex), true);
    }
    setShowReplies(newVisible);

    if (!newVisible) {
      // ✅ Promote injected comments to permanent with isPromoted flag
      queryClient.setQueryData(queryKeys.postComments(PostHashHex), (data) => {
        if (!data) return;

        const page0 = data.pages[0];
        const injected = page0.comments.filter(c => c.isLocal);
        const rest = page0.comments.filter(c => !c.isLocal);

        // Mark promoted comments so they can be identified later
        const promoted = injected.map(c => ({ ...c, isLocal: undefined, isPromoted: true }));
        const merged = [...promoted, ...rest];

        return {
          ...data,
          pages: [
            {
              ...page0,
              comments: merged,
            },
            ...data.pages.slice(1),
          ],
        };
      });

      return;
    }

    if (shouldFetchFirstPage.current) {
      shouldFetchFirstPage.current = false;

      // Get current query data
      const currentData = queryClient.getQueryData(queryKeys.postComments(PostHashHex));
      const existingComments = currentData?.pages?.[0]?.comments || [];
      
      const localComments = existingComments.filter(c => c.isLocal);
      const hasServerData = existingComments.some(c => !c.isLocal && !c.isPromoted);

      // If we already have server data, just promote local comments without refetching
      if (hasServerData) {
        queryClient.setQueryData(queryKeys.postComments(PostHashHex), (data) => {
          if (!data) return;

          const page0 = data.pages[0];
          const local = page0.comments.filter(c => c.isLocal);
          const nonLocal = page0.comments.filter(c => !c.isLocal);

          const promoted = local.map(c => ({ ...c, isLocal: undefined, isPromoted: true }));
          const merged = [...promoted, ...nonLocal];

          return {
            ...data,
            pages: [
              {
                ...page0,
                comments: merged,
              },
              ...data.pages.slice(1),
            ],
          };
        });
      } else {
        // Only refetch if we don't have server data yet
        const promotedComments = existingComments.filter(c => c.isPromoted);

        refetch().then(() => {
          queryClient.setQueryData(queryKeys.postComments(PostHashHex), (newData) => {
            if (!newData) return;

            const serverHashes = new Set(
              newData.pages.flatMap(p => p.comments.map(c => c.PostHashHex))
            );

            // Promote current local comments and preserve existing promoted comments
            const promotedLocal = localComments
              .filter(c => !serverHashes.has(c.PostHashHex))
              .map(c => ({ ...c, isLocal: undefined, isPromoted: true }));

            const preservedPromoted = promotedComments
              .filter(c => !serverHashes.has(c.PostHashHex));

            const allUserComments = [...promotedLocal, ...preservedPromoted];
            const merged = [...allUserComments, ...newData.pages[0].comments];

            return {
              ...newData,
              pages: [
                {
                  ...newData.pages[0],
                  comments: merged,
                },
                ...newData.pages.slice(1),
              ],
            };
          });
        });
      }
    }
  };

  return (
    <div className={`${styles.post} ${isQuote ? styles.quote : ''} ${isComment ? styles.comment : ''}`}>

      {!isComment && (
        <div className={styles.avatarContainer}>
          <Avatar profile={ProfileEntryResponse || userProfile} size={48} />
        </div>
      )}

      <div className={styles.postContentContainer}>
        <div className={styles.header}>
          {isComment ? (
            <Avatar profile={ProfileEntryResponse || userProfile} size={40} />
          ) : (
            <div className={styles.mobileAvatarContainer}>
              <Avatar profile={ProfileEntryResponse || userProfile} size={45} />
            </div>
          )}

          <div className={styles.postSummary}>
            <div className={styles.postLinks}>
              <div className={styles.userLinksWrapper}>
                {displayName && (
                  <Link href={`/${lookupKey}`} className={styles.displayName} prefetch={false}>{displayName}</Link>
                )}
                {isPublicKey ? (
                  <Link href={`/${lookupKey}`} className={styles.publicKey} prefetch={false}>{lookupKey}</Link>
                ) : (
                  <Link href={`/${lookupKey}`} className={styles.username} prefetch={false}>@{lookupKey}</Link>
                )}
              </div>
              <div className={styles.postLinkWrapper}>
                <Link href={`/${lookupKey}/posts/${PostHashHex}`} className={styles.postLink} prefetch={false}>{PostHashHex}</Link>
              </div>
            </div>
            <div className={styles.postControls}>
              {(Body || (ImageURLs && ImageURLs.length > 0)) && (
                <button 
                  onClick={() => {
                    setShowRaw(prev => {
                      const newVal = !prev;
                      queryClient.setQueryData(uiKeys.rawVisible(PostHashHex), newVal);
                      return newVal;
                    });
                  }} 
                  className={styles.toggleRawButton}
                >
                  {showRaw ? 'Show Rendered 📄' : 'Show Raw 📝'}
                </button>                
              )}
            </div>
          </div>
        </div>

        {Body && (
          <div className={styles.postBody}>
            {showRaw ? <pre>{Body.replace(/\\/g, '\\\\')}</pre> : <MarkdownText text={Body} />}
          </div>
        )}

        {ImageURLs && ImageURLs.length > 0 && (
          <div className={styles.imageGallery}>
            {showRaw 
            ?          
            <>
              {ImageURLs?.length > 0 && (
                <pre>
                  {ImageURLs.map((url) => `${url}\n`).join('')}
                </pre>
              )}            
            </>
            : 
            <>
              {ImageURLs.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className={styles.postImage}
                  width={800} // Provide a reasonable width for optimization
                  height={800} // Provide a reasonable height for optimization
                  // loading="lazy" is default
                  // object-fit: contain is in styles.postImage
                />
              ))}
            </>
            }
          </div>
        )}        

        {RepostedPostEntryResponse && (
          <div className={styles.repost}>
            <Post post={RepostedPostEntryResponse} isQuote />
          </div>
        )}

        <PostStats
          post={post}
          onReply={handleReplyCallback}
        />

        {CommentCount > 0 && (
          <button onClick={toggleReplies} className={styles.repliesButton}>
            {isLoading
              ? 'Loading replies...'
              : showReplies
              ? 'Hide replies'
              : 'See replies...'}
          </button>
        )}

        {!showReplies && injectedComments.length > 0 && (
          <div className={styles.repliesContainer}>
            <div className={styles.replies}>
              {injectedComments.map((comment) => (
                <Post key={comment.PostHashHex} post={comment} isComment />
              ))}
            </div>
          </div>
        )}        

        {showReplies && (
          <div className={styles.repliesContainer}>
            <div className={styles.replies}>
              {comments.map((comment) => (
                <Post key={comment.PostHashHex} post={comment} isComment />
              ))}
            </div>
            {hasNextPage && (
              <button
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
                className={styles.loadMoreButton}
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load more replies'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Memoized component
export const Post = memo(PostComponent);