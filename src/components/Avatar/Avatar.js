"use client";

import Image from 'next/image'; // Import next/image
import { memo } from 'react'; // Import memo
import { avatarUrl } from "@/utils/profileUtils";
import { DefaultAvatar } from "@/assets/icons";
import styles from "./Avatar.module.css";

const AvatarComponent = ({ profile, size = "medium", className = "" }) => {
  const avatar = avatarUrl(profile);

  const sizePx =
    typeof size === "number"
      ? size
      : size === "small"
      ? 30
      : size === "large"
      ? 64
      : 40; // default: medium (40px)

  return (
    <div
      className={`${styles.avatarFrame} ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt="User avatar"
          className={styles.avatarImage}
          width={sizePx} // Prop for next/image
          height={sizePx} // Prop for next/image
        />
      ) : (
        <div className={styles.fallbackAvatar}>
          <DefaultAvatar />
        </div>
      )}
    </div>
  );
};

export const Avatar = memo(AvatarComponent);
