import Image from 'next/image';
import { Avatar } from '@/components/Avatar';
import { PublicKeyDisplay } from '@/components/PublicKeyDisplay';

import { MarkdownText } from '@/components/MarkdownText';

import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

import styles from './Profile.module.css';

export const Profile = ({ profile, rawParam, isLoading, isError, error }) => {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState message={error?.message || 'Something went wrong'} rawParam={rawParam} />;
    if (!profile) return <ErrorState message={`Profile not found`} rawParam={rawParam} />;

    return (
        <div className={styles.container}>

            {
                profile?.ExtraData?.FeaturedImageURL &&
                <div className={styles.coverImageContainer}>
                    <Image 
                        alt="Cover image"
                        src={profile.ExtraData.FeaturedImageURL} 
                        fill
                        className={styles.coverImage}
                        priority // Consider prioritizing if it's LCP
                    />
                </div>
            }

            <div className={styles.profileContainer}>

                <Avatar profile={profile} size={180} />

                <div className={styles.profileDetails}>
                    {
                        profile?.ExtraData?.DisplayName && <div className={styles.displayName}>{profile?.ExtraData?.DisplayName}</div>
                    }

                    <div className={styles.basic}>
                        <div className={styles.username}>@{profile.Username}</div>
                        <PublicKeyDisplay value={profile?.PublicKeyBase58Check} mode="full"/>
                    </div>

                    {
                        profile?.Description &&
                        <div className={styles.description}>
                            <MarkdownText text={profile.Description} />                          
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};
