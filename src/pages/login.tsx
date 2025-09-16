
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // store Basic auth token (base64 of username:password)
    const token = btoa(`${username}:${password}`);
    localStorage.setItem("auth.basic", token);
    // redirect to enrollments
    setLocation("/enrollments");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-card rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full input" />
        </div>
        <div>
          <button className="btn btn-primary w-full" type="submit">Login</button>
        </div>
      </form>
      <p className="text-sm text-muted-foreground mt-3">This demo stores Basic auth token in localStorage for API requests.</p>
    </div>
  );
}
