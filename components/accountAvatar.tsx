import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AccountAvatarProps = {
  src: string | null;
  alt: string | null;
  username: string | null;
};

const AccountAvatar = ({ src, alt, username }: AccountAvatarProps) => {
  const firstLetter = username ? username[0].toUpperCase() : "U";

  let imageSrc = src ? src : "";
  let imageAlt = alt ? alt : "username";

  return (
    <Avatar>
      <AvatarImage src={imageSrc} alt={imageAlt} />
      <AvatarFallback className="bg-zinc-500 text-zinc-200">
        {firstLetter}
      </AvatarFallback>
    </Avatar>
  );
};

export default AccountAvatar;
