import express from 'express';
import cors from 'cors';
import {createClient} from '@supabase/supabase-js';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient("https://pmyqzhztfaoldvmqkzqj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBteXF6aHp0ZmFvbGR2bXFrenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDQ0MzEsImV4cCI6MjA3NjQ4MDQzMX0.gPY7cMwvhXRpLstt5D0wR_XyoQNv1jRdbScADfQa9ME");

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({error: 'Missing email or password'});

    try {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        if (error) return res.status(401).json({error: error.message});

        res.json({jwtToken: data.session.access_token, user: data.user});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({error: 'Missing email or password'});

    try {
        const {data, error} = await supabase.auth.signUp({email, password});
        if (error) return res.status(400).json({error: error.message});

        res.json({jwtToken: data.session.access_token, user: data.user});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.listen(4000, () => console.log('Auth-service running on 4000'));