# Working with Supabase in a Vite + React + Vercel Project

This guide outlines how to integrate Supabase with a Vite + React project deployed on Vercel, based on real implementation experience.

## Project Structure

```
your-project/
├── src/
│   ├── lib/
│   │   └── supabase.js       # Supabase client configuration
│   ├── components/
│   │   └── YourComponent.jsx # Components using Supabase
│   └── ...
├── .env.local                # Local environment variables
├── .gitignore
├── package.json
└── vite.config.js
```

## Step-by-Step Guide

### 1. Initial Setup

1. Create a Vite + React project if you haven't already:
   ```bash
   npm create vite@latest my-project -- --template react
   cd my-project
   npm install
   ```

2. Install the Supabase client library:
   ```bash
   npm install @supabase/supabase-js
   ```

### 2. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)

2. Create your database table(s) in Supabase:
   - Go to Table Editor
   - Click "Create a new table"
   - Define your schema (e.g., for a questions table):
     ```sql
     create table questions (
       id uuid default uuid_generate_v4() primary key,
       content text not null,
       email text,
       timestamp timestamptz default now(),
       status text default 'pending'
     );
     ```

3. Set up table permissions:
   - Go to Authentication > Policies
   - Add policies for your table (e.g., for public access):
     ```sql
     -- Enable insert access
     create policy "Enable insert for anonymous users"
     on questions for insert
     to anon
     with check (true);
     ```

### 3. Environment Variables

1. Create a `.env.local` file in your project root:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   Get these values from: Supabase Dashboard > Settings > API

2. Add `.env.local` to your `.gitignore`:
   ```
   .env.local
   .env.*.local
   ```

### 4. Supabase Client Setup

1. Create `src/lib/supabase.js`:
   ```javascript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   if (!supabaseUrl || !supabaseAnonKey) {
     throw new Error('Missing Supabase credentials');
   }

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

### 5. Using Supabase in Components

Example component using Supabase:

```jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

function YourComponent() {
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('your_table')
        .insert([{ content: data }]);

      if (supabaseError) throw supabaseError;
      
      // Handle success
      setData('');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 6. Vercel Deployment

1. Push your code to GitHub

2. Connect your repository to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Create New Project
   - Import your repository
   - Select the Vite framework preset

3. Add environment variables to Vercel:
   - Go to Project Settings > Environment Variables
   - Add the same variables from your `.env.local`:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

### 7. Common Issues and Solutions

1. **Environment Variables Not Loading**
   - Make sure variables start with `VITE_` prefix
   - No spaces or quotes in `.env.local`
   - Restart dev server after changes

2. **CORS Issues**
   - Check Supabase project settings
   - Ensure proper headers in requests
   - Verify API URL format

3. **Deployment Issues**
   - Verify environment variables in Vercel
   - Check build logs for errors
   - Ensure all dependencies are installed

### 8. Best Practices

1. **Error Handling**
   ```javascript
   try {
     const { data, error } = await supabase.from('table').select();
     if (error) throw error;
   } catch (error) {
     console.error('Error:', error.message);
   }
   ```

2. **Type Safety**
   - Consider using TypeScript
   - Define types for your database schema

3. **Security**
   - Never expose admin keys
   - Use RLS policies
   - Validate data on both client and server

4. **Performance**
   - Use appropriate indexes
   - Implement pagination
   - Cache when possible

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev/)

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify environment variables
3. Test Supabase connection
4. Check network requests
5. Verify table permissions
6. Review RLS policies 