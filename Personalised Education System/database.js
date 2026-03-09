/* =============================================
   PERSONALIZED EDUCATION RECOMMENDATION SYSTEM
   Database Layer (Supabase)
   ============================================= */

const supabaseUrl = 'https://ynasdyjmbabmzbuujxql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYXNkeWptYmFibXpidXVqeHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTc0NzYsImV4cCI6MjA4ODYzMzQ3Nn0.45i6swlnFsDMyxUaK_kTJ9xhU2SsE0D-cCBQz-N4ivs';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

var DB = (function () {

    // ---- Session State (Synchronous helpers) ----

    function getCurrentUser() {
        try {
            var data = sessionStorage.getItem('pers_current_user');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    function setCurrentUser(user) {
        sessionStorage.setItem('pers_current_user', JSON.stringify(user));
    }

    function getCurrentProfile() {
        try {
            var data = sessionStorage.getItem('pers_current_profile');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    function setCurrentProfile(profile) {
        sessionStorage.setItem('pers_current_profile', JSON.stringify(profile));
    }

    function isAdminLoggedIn() {
        return sessionStorage.getItem('pers_admin') === 'true';
    }

    function logout() {
        sessionStorage.removeItem('pers_current_user');
        sessionStorage.removeItem('pers_current_profile');
        sessionStorage.removeItem('pers_admin');
    }

    // ---- Async Database Operations (Supabase) ----

    async function registerUser(username, email, password) {
        const { data: existingUser } = await supabaseClient
            .from('users')
            .select('*')
            .or(`username.eq.${username},email.eq.${email}`);

        if (existingUser && existingUser.length > 0) {
            const user = existingUser.find(u => u.username === username);
            if (user) return { success: false, message: 'Username already exists.' };
            return { success: false, message: 'Email already registered.' };
        }

        const { data, error } = await supabaseClient
            .from('users')
            .insert([{ username, email, password }])
            .select();

        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true, message: 'Account created successfully!' };
    }

    async function loginUser(username, password) {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !data) {
            return { success: false, message: 'Invalid username or password.' };
        }

        // Save current user to session
        setCurrentUser(data);

        // Fetch user's profile if it exists
        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('user_id', data.id)
            .single();

        if (profile) setCurrentProfile({
            firstName: profile.first_name,
            middleName: profile.middle_name,
            lastName: profile.last_name,
            email: profile.email,
            phone: profile.phone,
            gender: profile.gender,
            education: profile.education,
            interest: profile.interest,
            skills: profile.skills
        });

        return { success: true, user: data };
    }

    async function adminLogin(username, password) {
        // Default admin credentials
        if (username === 'admin' && password === 'admin123') {
            sessionStorage.setItem('pers_admin', 'true');
            return { success: true };
        }
        return { success: false, message: 'Invalid admin credentials.' };
    }

    async function resetPassword(email, newPassword) {
        const { data: user } = await supabaseClient
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (!user) {
            return { success: false, message: 'Email not found.' };
        }

        const { error } = await supabaseClient
            .from('users')
            .update({ password: newPassword })
            .eq('id', user.id);

        if (error) return { success: false, message: error.message };
        return { success: true, message: 'Password reset successfully!' };
    }

    async function getAllUsers() {
        const { data } = await supabaseClient.from('users').select('*');
        return data || [];
    }

    async function deleteUser(userId) {
        await supabaseClient.from('users').delete().eq('id', userId);
    }

    async function createProfile(profileData) {
        var user = getCurrentUser();
        if (!user) return { success: false, message: 'Not logged in.' };

        const { data, error } = await supabaseClient
            .from('profiles')
            .insert([{
                user_id: user.id,
                first_name: profileData.firstName,
                middle_name: profileData.middleName,
                last_name: profileData.lastName,
                email: profileData.email,
                phone: profileData.phone,
                gender: profileData.gender,
                education: profileData.education,
                interest: profileData.interest,
                skills: profileData.skills
            }]);

        if (error) {
            if (error.code === '23505') return { success: false, message: 'Profile already exists. Use Update Profile instead.' };
            return { success: false, message: error.message };
        }

        setCurrentProfile(profileData);
        return { success: true, message: 'Profile created successfully!' };
    }

    async function updateProfile(profileData) {
        var user = getCurrentUser();
        if (!user) return { success: false, message: 'Not logged in.' };

        // check if exists first
        const { data: existing } = await supabaseClient.from('profiles').select('id').eq('user_id', user.id).single();

        let error;
        if (existing) {
            const res = await supabaseClient
                .from('profiles')
                .update({
                    first_name: profileData.firstName,
                    middle_name: profileData.middleName,
                    last_name: profileData.lastName,
                    email: profileData.email,
                    phone: profileData.phone,
                    gender: profileData.gender,
                    education: profileData.education,
                    interest: profileData.interest,
                    skills: profileData.skills,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);
            error = res.error;
        } else {
            const res = await supabaseClient
                .from('profiles')
                .insert([{
                    user_id: user.id,
                    first_name: profileData.firstName,
                    middle_name: profileData.middleName,
                    last_name: profileData.lastName,
                    email: profileData.email,
                    phone: profileData.phone,
                    gender: profileData.gender,
                    education: profileData.education,
                    interest: profileData.interest,
                    skills: profileData.skills
                }]);
            error = res.error;
        }

        if (error) {
            return { success: false, message: error.message };
        }

        setCurrentProfile(profileData);
        return { success: true, message: 'Profile updated successfully!' };
    }

    async function getAllProfiles() {
        const { data } = await supabaseClient.from('profiles').select('*');
        if (!data) return [];
        return data.map(p => ({
            userId: p.user_id,
            firstName: p.first_name,
            middleName: p.middle_name,
            lastName: p.last_name,
            email: p.email,
            phone: p.phone,
            gender: p.gender,
            education: p.education,
            interest: p.interest,
            skills: p.skills
        }));
    }

    async function deleteProfile(userId) {
        await supabaseClient.from('profiles').delete().eq('user_id', userId);
        if (getCurrentUser()?.id === userId) {
            sessionStorage.removeItem('pers_current_profile');
        }
    }

    async function submitFeedback(email, rating, message) {
        const { data, error } = await supabaseClient
            .from('feedbacks')
            .insert([{ email, rating, message }]);

        if (error) return { success: false, message: error.message };
        return { success: true, message: 'Feedback submitted successfully!' };
    }

    async function getAllFeedbacks() {
        const { data } = await supabaseClient.from('feedbacks').select('*');
        return data || [];
    }

    function seedDemoData() {
        // Obsolete for external DB.
    }

    // Public API
    return {
        registerUser,
        loginUser,
        adminLogin,
        getCurrentUser,
        isAdminLoggedIn,
        logout,
        resetPassword,
        getAllUsers,
        deleteUser,
        createProfile,
        updateProfile,
        getCurrentProfile,
        getAllProfiles,
        deleteProfile,
        submitFeedback,
        getAllFeedbacks,
        seedDemoData
    };
})();
