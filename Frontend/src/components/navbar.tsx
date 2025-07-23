import { GuestNavbar } from './GuestNavbar';
import { MainNavbar } from './MainNavbar';

interface NavbarProps {
  user: any;
  setUser: (user: any) => void;
}

export const Navbar = ({ user, setUser }: NavbarProps) => {
  return user ? <MainNavbar user={user} setUser={setUser} /> : <GuestNavbar />;
};
