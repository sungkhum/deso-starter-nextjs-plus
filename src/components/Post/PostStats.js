"use client";

import { useState, memo, useCallback } from "react"; // Import memo and useCallback
import { useDeSoApi } from "@/api/useDeSoApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import styles from "./Post.module.css";

import { Button } from "@/components/Button";

// PostStats component handles the stats (💬 🔁 ❤️ 💎) display
// and manages the inline reply UI and submission logic.
const PostStatsComponent = ({ post, onReply }) => {
  const {
    PostHashHex,
    CommentCount,
    LikeCount,
    DiamondCount,
    RepostCount,
    QuoteRepostCount,
  } = post;

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  
  // ✅ Local state to track comment count for optimistic updates
  const [localCommentCount, setLocalCommentCount] = useState(CommentCount);

  const { submitPost } = useDeSoApi();
  const { signAndSubmitTransaction, userPublicKey } = useAuth();
  const { showErrorToast } = useToast();

  const closeReplyBox = useCallback(() => {
    setShowReplyBox(false);
  }, []); // No dependencies, setShowReplyBox is stable

  const handleReply = async () => {
    setLoading(true);
    try {
      const settings = {
        UpdaterPublicKeyBase58Check: userPublicKey,
        ParentStakeID: PostHashHex,
        BodyObj: { Body: replyText },
        MinFeeRateNanosPerKB: 1500,
      };

      const result = await submitPost(settings);
      if (result.error) throw new Error(result.error);

      const tx = await signAndSubmitTransaction(result.data.TransactionHex);

      // ✅ Increment local comment count optimistically
      setLocalCommentCount(prev => prev + 1);

      // ✅ Calls parent handler to inject fresh reply
      if (onReply) onReply(tx?.PostEntryResponse);

      // ✅ Reset UI state after success
      setReplyText("");
      setShowReplyBox(false);
    } catch (err) {
      showErrorToast(`Reply failed: ${err.message}`);
      // Note: We don't decrement on error since the increment only happens on success
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.stats}>
        {/* 💬 icon clickable only if user is authenticated */}
        <span
          onClick={userPublicKey ? () => setShowReplyBox((prev) => !prev) : undefined}
          style={{ cursor: userPublicKey ? "pointer" : "default" }}
          title={userPublicKey ? "Reply to this post" : "Login to reply"}
        >
          💬 {localCommentCount}
        </span>

        <span>🔁 {RepostCount + QuoteRepostCount}</span>
        <span>❤️ {LikeCount}</span>
        <span>💎 {DiamondCount}</span>
      </div>

      {/* Inline reply UI */}
      {showReplyBox && (
        <div className={styles.replyBox}>
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your comment..."
            disabled={loading}
          />
          <div className={styles.replyActions}>
            <Button
              onClick={closeReplyBox}
              disabled={loading}
              variant="secondary"
              size="small"
            >
                Cancel</Button>
            <Button 
                onClick={handleReply} // handleReply is already a stable function within this component's render scope
                isLoading={loading}
                disabled={!replyText}
                variant="primary"
                size="small"
            >
              {loading ? "Posting..." : "Reply"}    
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export const PostStats = memo(PostStatsComponent);