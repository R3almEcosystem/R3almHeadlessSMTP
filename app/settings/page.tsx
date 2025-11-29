// Replace this line:
// const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'change-me-immediately';

// With this:
import { getAdminPassword, setAdminPassword } from '@/lib/smtp';
const [storedPassword, setStoredPassword] = useState<string>('');

// Add this in useEffect after loading config:
useEffect(() => {
  getAdminPassword().then(setStoredPassword);
}, []);

// In handleSubmit, replace password check with:
if (password !== storedPassword) {
  setMessage({ type: 'error', text: 'Wrong password' });
  return;
}