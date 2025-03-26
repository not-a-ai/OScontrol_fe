import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  userName: string;
  userImage: string;
}

const Header = ({ userName, userImage }: HeaderProps) => {
  return (
    <header className="bg-blue text-white p-4 flex items-center justify-between shadow-md">
      <h1 className="text-lg font-bold">Painel de Ordens de Serviço</h1>
      <div className="flex items-center gap-3">
        <span>{userName}</span>
        <Avatar>
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
