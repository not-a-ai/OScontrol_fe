import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useUser } from '@/services/UserContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const userName = user?.nome || 'Usuário';
  const userImage = '/src/assets/avatar.png';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (isLoading) {
    return null;
  }
  return (
    <header className="bg-blue text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{userName}</span>
      </div>

      <Button onClick={handleLogout}>
        <LogOut />
      </Button>
    </header>
  );
};

export default Header;
