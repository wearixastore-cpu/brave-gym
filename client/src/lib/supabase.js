import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Detect if Supabase is properly configured with live credentials
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project-id")
);

// Fallback dummy client or real client to avoid crashing if env vars are missing
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// ==========================================
// SUPABASE AUTH HELPERS
// ==========================================

export async function supabaseSignUp(email, password, metadata = {}) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase is not configured yet. Check .env variables.") };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  return { data, error };
}

export async function supabaseSignIn(email, password) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase is not configured yet. Check .env variables.") };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
}

export async function supabaseSignOut() {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function supabaseGetSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ==========================================
// USER PROFILE HELPERS
// ==========================================

export async function getProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("Could not fetch profile from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function updateProfileData(userId, fields) {
  if (!supabase || !userId) return { data: null, error: null };
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...fields,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}

// ==========================================
// STORAGE: AVATAR & MEDIA UPLOAD HELPERS
// ==========================================

export async function uploadAvatar(userId, file) {
  if (!supabase || !userId || !file) {
    return { url: null, error: new Error("Supabase storage not configured or missing file") };
  }

  try {
    const fileExt = file.name ? file.name.split(".").pop() : "jpg";
    const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Save avatar_url in profiles
    await updateProfileData(userId, { avatar_url: publicUrlData.publicUrl });

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    console.error("Error uploading avatar to Supabase:", err);
    return { url: null, error: err };
  }
}

// ==========================================
// CLASSES & TIMETABLE HELPERS
// ==========================================

export async function fetchClasses() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.warn("Error loading classes from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function createClass(classItem) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("classes")
    .insert([
      {
        id: classItem.id || `sc-${Date.now()}`,
        day: classItem.day,
        time: classItem.time,
        class_title: classItem.classTitle || classItem.class_title,
        trainer: classItem.trainer,
        spots_left: classItem.spotsLeft ?? classItem.spots_left ?? classItem.total,
        total: classItem.total
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating class in Supabase:", error.message);
    return null;
  }
  return data;
}

export async function deleteClass(classId) {
  if (!supabase) return;
  const { error } = await supabase.from("classes").delete().eq("id", classId);
  if (error) console.error("Error deleting class in Supabase:", error.message);
}

// ==========================================
// BOOKINGS HELPERS
// ==========================================

export async function fetchBookings(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Error loading bookings from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function fetchAllBookings() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Error loading all bookings from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function createBooking(userId, bookingItem, userMeta = {}) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        id: `bk-${Date.now()}`,
        user_id: userId,
        class_title: bookingItem.classTitle,
        trainer: bookingItem.trainer,
        date: bookingItem.date,
        room: bookingItem.room || "Main Athletic Floor",
        status: "Confirmed",
        user_name: userMeta.name || "Brave Member",
        user_email: userMeta.email || ""
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating booking in Supabase:", error.message);
    return null;
  }
  return data;
}

export async function removeBooking(bookingId) {
  if (!supabase) return;
  const { error } = await supabase.from("bookings").delete().eq("id", bookingId);
  if (error) console.error("Error removing booking in Supabase:", error.message);
}

// ==========================================
// WORKOUT LOGS HELPERS
// ==========================================

export async function fetchWorkoutLogs(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Error loading workout logs from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function fetchAllWorkoutLogs() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Error loading all workout logs from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function insertWorkoutLog(userId, logItem) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("workout_logs")
    .insert([
      {
        id: `log-${Date.now()}`,
        user_id: userId,
        exercise: logItem.exercise,
        weight: logItem.weight || "Bodyweight",
        notes: logItem.notes || "",
        date: logItem.date || "Today"
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding workout log to Supabase:", error.message);
    return null;
  }
  return data;
}

// ==========================================
// CONSULTATION REQUESTS HELPERS
// ==========================================

export async function fetchConsultations() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Error loading consultations from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function submitConsultation(req) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("consultations")
    .insert([
      {
        id: `req-${Date.now().toString().slice(-4)}`,
        user_id: req.userId || null,
        trainer_id: req.trainerId || null,
        trainer_name: req.trainerName,
        user_name: req.userName,
        phone: req.phone,
        address: req.address || "",
        service_type: req.serviceType,
        custom_requirements: req.customRequirements || "",
        chat_messages: req.chatMessages || [],
        status: "Pending"
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating consultation in Supabase:", error.message);
    return null;
  }
  return data;
}

export async function setConsultationStatus(id, newStatus) {
  if (!supabase) return;
  const { error } = await supabase
    .from("consultations")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) console.error("Error updating consultation status in Supabase:", error.message);
}

export async function deleteConsultation(id) {
  if (!supabase) return;
  const { error } = await supabase
    .from("consultations")
    .delete()
    .eq("id", id);

  if (error) console.error("Error deleting consultation in Supabase:", error.message);
}

// ==========================================
// NOTIFICATIONS HELPERS & REALTIME
// ==========================================

export async function fetchNotifications(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Error loading notifications from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function markAllNotificationsRead(userId) {
  if (!supabase || !userId) return;
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId);

  if (error) console.error("Error marking notifications read in Supabase:", error.message);
}

export async function sendNotification(userId, title, message, type = "admin_response") {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        id: `notif-${Date.now()}`,
        user_id: userId,
        title,
        message,
        type,
        read: false
      }
    ])
    .select()
    .single();

  if (error) console.error("Error creating notification in Supabase:", error.message);
  return data;
}

// ==========================================
// TRANSACTIONS & FINANCIAL AUDIT HELPERS
// ==========================================

export async function fetchTransactions() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Error fetching transactions from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function recordTransaction({ userId, member, plan, amount, date = "Today" }) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        id: `tx-${Date.now().toString().slice(-6)}`,
        user_id: userId || null,
        member: member || "Athlete",
        plan: plan || "Membership Tier",
        amount: String(amount).startsWith("$") ? amount : `$${amount}`,
        status: "Paid",
        date: date || "Today"
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating transaction in Supabase:", error.message);
    return null;
  }
  return data;
}

// ==========================================
// PROFILES ROSTER HELPERS (FOR ADMIN KPI)
// ==========================================

export async function fetchAllProfiles() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Error fetching all profiles from Supabase:", error.message);
    return null;
  }
  return data;
}

