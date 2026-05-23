INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2b$10$a0cMsG6zxGWQ8v1zzayEqeepr5h60f5MxDstNn2lMvqn/0hCOwjQK',
  'ADMIN'
)
ON CONFLICT (email) DO NOTHING;
