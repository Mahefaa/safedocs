import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = 5000;
const SUPABASE_URL = "";
const SUPABASE_KEY = "";

// List files for a given user
app.get('/files', async (req, res) => {
    const userId = req.query.userId;
    const token = req.headers.authorization;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        global:{
            headers:{
                Authorization: token
            }
        }
    });

    try {
        const { data, error } = await supabase
            .from('files')
            .select('id, filename, url, created_at')
            .eq('user_id', '0a2b68b1-5be8-4e55-bc00-6389c7ede346')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ files: data });
    } catch (err) {
        console.error('File Service list error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`📂 File Service running on port ${PORT}`));