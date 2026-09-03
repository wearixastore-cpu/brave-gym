import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_PROGRAMS, INITIAL_TRAINERS, INITIAL_MEMBERSHIPS, INITIAL_SCHEDULE } from "../lib/mockData";
import {
  supabase,
  isSupabaseConfigured,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  getProfile,
  updateProfileData,
  uploadAvatar,
  fetchClasses,
  createClass as sbCreateClass,
  deleteClass as sbDeleteClass,
  fetchBookings,
  fetchAllBookings,
  createBooking as sbCreateBooking,
  removeBooking as sbRemoveBooking,
  fetchWorkoutLogs,
  insertWorkoutLog as sbInsertWorkoutLog,
  fetchConsultations,
  submitConsultation as sbSubmitConsultation,
  setConsultationStatus as sbSetConsultationStatus,
  fetchNotifications,
  markAllNotificationsRead as sbMarkAllNotificationsRead,
  sendNotification as sbSendNotification,
  fetchTransactions,
  recordTransaction,
  fetchAllProfiles
} from "../lib/supabase";

const GymContext = createContext(null);

export function GymProvider({ children }) {
  // Current user state (null when not logged in)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("brave_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [programs] = useState(INITIAL_PROGRAMS);
  const [trainers] = useState(INITIAL_TRAINERS);
  const [memberships] = useState(INITIAL_MEMBERSHIPS);
  const [schedule, setSchedule] = useState([]);

  // User's booked classes
  const [bookings, setBookings] = useState([]);

  // Admin view of all member bookings across the facility
  const [adminBookings, setAdminBookings] = useState([]);

  // Workout log items
  const [workoutLogs, setWorkoutLogs] = useState([]);

  // Consultation Requests sent to Admin
  const [consultationRequests, setConsultationRequests] = useState(() => {
    const saved = localStorage.getItem("brave_consultations");
    return saved ? JSON.parse(saved) : [];
  });

  // Admin stats
  const [adminStats, setAdminStats] = useState({
    monthlyRevenue: 0,
    activeMembers: 0,
    todayOccupancy: 0,
    newSignupsThisWeek: 0,
    recentTransactions: []
  });

  // Real-time notifications
  const [userNotifications, setUserNotifications] = useState(() => {
    const saved = localStorage.getItem("brave_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local cache as fallback
  useEffect(() => {
    localStorage.setItem("brave_notifications", JSON.stringify(userNotifications));
  }, [userNotifications]);

  useEffect(() => {
    localStorage.setItem("brave_consultations", JSON.stringify(consultationRequests));
  }, [consultationRequests]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("brave_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("brave_user");
    }
  }, [currentUser]);

  // ==========================================================
  // SUPABASE DATA SYNC: Classes, Consultations, Bookings, Logs
  // ==========================================================
  const loadRemoteData = useCallback(async (userId, role = null) => {
    if (!isSupabaseConfigured || !supabase) return;

    // Load classes
    const remoteClasses = await fetchClasses();
    if (Array.isArray(remoteClasses)) {
      setSchedule(
        remoteClasses.map((c) => ({
          id: c.id,
          day: c.day,
          time: c.time,
          classTitle: c.class_title,
          trainer: c.trainer,
          spotsLeft: c.spots_left,
          total: c.total
        }))
      );
    } else {
      setSchedule([]);
    }

    // Load consultations
    const remoteConsultations = await fetchConsultations();
    if (remoteConsultations && remoteConsultations.length > 0) {
      setConsultationRequests(
        remoteConsultations.map((r) => ({
          id: r.id,
          trainerId: r.trainer_id,
          trainerName: r.trainer_name,
          userName: r.user_name,
          phone: r.phone,
          address: r.address,
          serviceType: r.service_type,
          customRequirements: r.custom_requirements,
          chatMessages: r.chat_messages || [],
          status: r.status,
          createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recently"
        }))
      );
    }

    // If admin, load system-wide financial telemetry and all member bookings
    if (role === "admin" || currentUser?.role === "admin") {
      const [allTx, allBk, allProf] = await Promise.all([
        fetchTransactions(),
        fetchAllBookings(),
        fetchAllProfiles()
      ]);

      if (allBk && allBk.length > 0) {
        setAdminBookings(
          allBk.map((b) => ({
            id: b.id,
            userId: b.user_id,
            userName: b.user_name || "Athlete",
            userEmail: b.user_email || "",
            classTitle: b.class_title,
            trainer: b.trainer,
            date: b.date,
            room: b.room,
            status: b.status,
            createdAt: b.created_at ? new Date(b.created_at).toLocaleDateString() : "Today"
          }))
        );
      }

      if (allTx) {
        const totalRevenue = allTx.reduce((sum, tx) => {
          const num = parseFloat(String(tx.amount).replace(/[^0-9.-]+/g, "")) || 0;
          return sum + num;
        }, 0);

        const activeCount = allProf?.length || 0;
        const totalSpots = (remoteClasses || []).reduce((sum, c) => sum + (c.total || 0), 0);
        const bookedSpots = (remoteClasses || []).reduce((sum, c) => sum + ((c.total || 0) - (c.spots_left || 0)), 0);
        const occupancy = totalSpots > 0 ? Math.round((bookedSpots / totalSpots) * 100) : 0;

        setAdminStats({
          monthlyRevenue: totalRevenue,
          activeMembers: activeCount,
          todayOccupancy: occupancy,
          newSignupsThisWeek: Math.min(activeCount, 8),
          recentTransactions: allTx.map((tx) => ({
            id: tx.id,
            member: tx.member,
            plan: tx.plan,
            amount: tx.amount,
            status: tx.status,
            date: tx.date || (tx.created_at ? new Date(tx.created_at).toLocaleDateString() : "Today")
          }))
        });
      }
    }

    // If logged in, fetch user-specific data
    if (userId) {
      const [remoteBookings, remoteLogs, remoteNotifs] = await Promise.all([
        fetchBookings(userId),
        fetchWorkoutLogs(userId),
        fetchNotifications(userId)
      ]);

      if (remoteBookings && remoteBookings.length > 0) {
        setBookings(
          remoteBookings.map((b) => ({
            id: b.id,
            classTitle: b.class_title,
            trainer: b.trainer,
            date: b.date,
            room: b.room,
            status: b.status
          }))
        );
      }

      if (remoteLogs && remoteLogs.length > 0) {
        setWorkoutLogs(
          remoteLogs.map((l) => ({
            id: l.id,
            date: l.date,
            exercise: l.exercise,
            weight: l.weight,
            notes: l.notes
          }))
        );
      }

      if (remoteNotifs && remoteNotifs.length > 0) {
        setUserNotifications(
          remoteNotifs.map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            read: n.read,
            type: n.type,
            time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently"
          }))
        );
      }
    }
  }, [currentUser?.role]);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Fetch active session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setCurrentUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role || "user",
            membership: profile.membership || "Black Tier",
            status: profile.status || "Active",
            renewalDate: profile.renewal_date || "Dec 31, 2026",
            streak: profile.streak || 1,
            sessionsThisMonth: profile.sessions_this_month || 0,
            avatar: profile.avatar_url || "/media/chris-kendall-sJ6az6-T1u8-unsplash.jpg",
            bio: profile.bio,
            phone: profile.phone,
            weightClass: profile.weight_class,
            discipline: profile.discipline
          });
          loadRemoteData(profile.id, profile.role);
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setCurrentUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role || "user",
            membership: profile.membership || "Black Tier",
            status: profile.status || "Active",
            renewalDate: profile.renewal_date || "Dec 31, 2026",
            streak: profile.streak || 1,
            sessionsThisMonth: profile.sessions_this_month || 0,
            avatar: profile.avatar_url || "/media/chris-kendall-sJ6az6-T1u8-unsplash.jpg",
            bio: profile.bio,
            phone: profile.phone,
            weightClass: profile.weight_class,
            discipline: profile.discipline
          });
          loadRemoteData(profile.id, profile.role);
        }
      } else if (event === "SIGNED_OUT") {
        // Logged out
      }
    });

    // Realtime channel subscriptions
    const channel = supabase
      .channel("brave-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const newN = payload.new;
        setUserNotifications((prev) => [
          {
            id: newN.id,
            title: newN.title,
            message: newN.message,
            type: newN.type,
            read: newN.read,
            time: "Just now"
          },
          ...prev
        ]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "consultations" }, (payload) => {
        const newC = payload.new;
        setConsultationRequests((prev) => [
          {
            id: newC.id,
            trainerId: newC.trainer_id,
            trainerName: newC.trainer_name,
            userName: newC.user_name,
            phone: newC.phone,
            address: newC.address,
            serviceType: newC.service_type,
            customRequirements: newC.custom_requirements,
            chatMessages: newC.chat_messages || [],
            status: newC.status,
            createdAt: "Just now"
          },
          ...prev
        ]);
      })
      .subscribe();

    return () => {
      authListener?.subscription?.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [loadRemoteData]);

  // Initial load
  useEffect(() => {
    loadRemoteData(currentUser?.id, currentUser?.role);
  }, [loadRemoteData, currentUser?.id, currentUser?.role]);

  // ==========================================
  // AUTH METHODS (SUPABASE WITH FALLBACK)
  // ==========================================

  const login = async (email, password, role = "user") => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail.includes("admin") || role === "admin";

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseSignIn(cleanEmail, password);
      if (error) {
        throw error;
      }
      if (data?.user) {
        const profile = await getProfile(data.user.id);
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || (isAdmin ? "Admin Director" : cleanEmail.split("@")[0]),
          role: profile?.role || (isAdmin ? "admin" : "user"),
          membership: profile?.membership || (isAdmin ? "Staff Command" : "Black Tier"),
          status: profile?.status || "Active",
          renewalDate: profile?.renewal_date || "Dec 31, 2026",
          streak: profile?.streak ?? (isAdmin ? 42 : 0),
          sessionsThisMonth: profile?.sessions_this_month ?? (isAdmin ? 24 : 0),
          avatar: profile?.avatar_url || (isAdmin 
            ? "/media/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg"
            : "/media/chris-kendall-sJ6az6-T1u8-unsplash.jpg")
        };
        setCurrentUser(userObj);
        return userObj;
      }
    }

    // Local / Offline fallback mode
    const userObj = {
      id: "usr-" + Date.now().toString().slice(-4),
      name: isAdmin ? "Admin Director" : (cleanEmail.split("@")[0].replace(".", " ") || "Brave Member"),
      email: cleanEmail,
      role: isAdmin ? "admin" : "user",
      membership: isAdmin ? "Staff Command" : "Black Tier",
      status: "Active",
      renewalDate: "Dec 31, 2026",
      streak: isAdmin ? 42 : 0,
      sessionsThisMonth: isAdmin ? 24 : 0,
      avatar: isAdmin 
        ? "/media/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg"
        : "/media/chris-kendall-sJ6az6-T1u8-unsplash.jpg"
    };
    setCurrentUser(userObj);
    return userObj;
  };

  const register = async (name, email, password, role = "user") => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail.includes("admin") || role === "admin";

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseSignUp(cleanEmail, password, {
        name,
        role: isAdmin ? "admin" : role
      });
      if (error) {
        throw error;
      }
      if (data?.user) {
        // If Supabase has "Confirm email" enabled, session will be null until verified
        const isEmailConfirmed = data.user.identities && data.user.identities.length > 0 && !data.session;
        const userObj = {
          id: data.user.id,
          name: name || "New Athlete",
          email: cleanEmail,
          role: isAdmin ? "admin" : role,
          membership: "Brave Trial",
          status: "Active",
          renewalDate: "30 Days Free",
          streak: 0,
          sessionsThisMonth: 0,
          avatar: "/media/david-guliciuc-o2zrjlM5s5o-unsplash.jpg"
        };
        if (data.session) {
          setCurrentUser(userObj);
        }
        return { ...userObj, requiresEmailConfirmation: isEmailConfirmed };
      }
    }

    // Local / Offline fallback mode
    const userObj = {
      id: "usr-" + Date.now().toString().slice(-4),
      name: name || "New Athlete",
      email: cleanEmail,
      role: isAdmin ? "admin" : "user",
      membership: "Brave Trial",
      status: "Active",
      renewalDate: "30 Days Free",
      streak: 0,
      sessionsThisMonth: 0,
      avatar: "/media/david-guliciuc-o2zrjlM5s5o-unsplash.jpg"
    };
    setCurrentUser(userObj);
    return userObj;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabaseSignOut();
    }
    setCurrentUser(null);
  };

  // ==========================================
  // CLASS BOOKINGS
  // ==========================================

  const bookClass = async (scheduleItem) => {
    const newBooking = {
      id: "bk-" + Date.now(),
      classTitle: scheduleItem.classTitle,
      trainer: scheduleItem.trainer,
      date: `${scheduleItem.day}, ${scheduleItem.time}`,
      status: "Confirmed",
      room: "Main Athletic Floor",
      userName: currentUser?.name || "Athlete",
      userEmail: currentUser?.email || ""
    };
    setBookings((prev) => [newBooking, ...prev]);
    setAdminBookings((prev) => [newBooking, ...prev]);

    setSchedule((prev) =>
      prev.map((sc) => (sc.id === scheduleItem.id ? { ...sc, spotsLeft: Math.max(0, sc.spotsLeft - 1) } : sc))
    );

    if (isSupabaseConfigured && currentUser?.id) {
      sbCreateBooking(currentUser.id, newBooking, {
        name: currentUser.name,
        email: currentUser.email
      });
    }
    return newBooking;
  };

  const purchasePlan = async (plan) => {
    // 1. Update current user state
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        membership: plan.name,
        status: "Active"
      };
      localStorage.setItem("brave_user", JSON.stringify(updated));
      return updated;
    });

    // 2. Persist membership update to Supabase profiles
    if (isSupabaseConfigured && currentUser?.id) {
      updateProfileData(currentUser.id, {
        membership: plan.name,
        status: "Active"
      });

      // 3. Record genuine financial transaction
      const newTx = await recordTransaction({
        userId: currentUser.id,
        member: currentUser.name || "Athlete",
        plan: plan.name,
        amount: `$${plan.price}`,
        date: "Today"
      });

      if (newTx) {
        setAdminStats((prev) => ({
          ...prev,
          monthlyRevenue: prev.monthlyRevenue + Number(plan.price || 0),
          recentTransactions: [
            {
              id: newTx.id,
              member: newTx.member,
              plan: newTx.plan,
              amount: newTx.amount,
              status: newTx.status,
              date: "Today"
            },
            ...prev.recentTransactions
          ]
        }));
      }
    } else {
      // Local fallback
      setAdminStats((prev) => ({
        ...prev,
        monthlyRevenue: prev.monthlyRevenue + Number(plan.price || 0),
        recentTransactions: [
          {
            id: `tx-${Date.now().toString().slice(-4)}`,
            member: currentUser?.name || "Athlete",
            plan: plan.name,
            amount: `$${plan.price}`,
            status: "Paid",
            date: "Today"
          },
          ...prev.recentTransactions
        ]
      }));
    }
  };

  const cancelBooking = async (bookingId) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    if (isSupabaseConfigured) {
      sbRemoveBooking(bookingId);
    }
  };

  // ==========================================
  // WORKOUT LOGS
  // ==========================================

  const addWorkoutLog = async (entry) => {
    const newLog = { id: "log-" + Date.now(), ...entry };
    setWorkoutLogs((prev) => [newLog, ...prev]);

    if (isSupabaseConfigured && currentUser?.id) {
      sbInsertWorkoutLog(currentUser.id, entry);
    }
  };

  // ==========================================
  // CONSULTATIONS & LEADS
  // ==========================================

  const addConsultationRequest = async (requestData) => {
    const newReq = {
      id: "req-" + Date.now().toString().slice(-4),
      createdAt: "Just now",
      status: "Pending",
      userId: currentUser?.id,
      ...requestData
    };
    setConsultationRequests((prev) => [newReq, ...prev]);

    if (isSupabaseConfigured) {
      sbSubmitConsultation(newReq);
    }
    return newReq;
  };

  const updateConsultationStatus = async (id, newStatus) => {
    setConsultationRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    if (isSupabaseConfigured) {
      sbSetConsultationStatus(id, newStatus);
    }
  };

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const markNotificationsAsRead = async () => {
    setUserNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (isSupabaseConfigured && currentUser?.id) {
      sbMarkAllNotificationsRead(currentUser.id);
    }
  };

  const createNotification = async (title, message, type = "admin_response") => {
    const newNotif = {
      id: "notif-" + Date.now(),
      title,
      message,
      type,
      read: false,
      time: "Just now"
    };
    setUserNotifications((prev) => [newNotif, ...prev]);

    if (isSupabaseConfigured && currentUser?.id) {
      sbSendNotification(currentUser.id, title, message, type);
    }
  };

  // ==========================================
  // PROFILE & STORAGE AVATAR
  // ==========================================

  const updateProfile = async (updatedFields) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("brave_user", JSON.stringify(updated));
      return updated;
    });

    if (isSupabaseConfigured && currentUser?.id) {
      const dbFields = {};
      if (updatedFields.name) dbFields.name = updatedFields.name;
      if (updatedFields.avatar) dbFields.avatar_url = updatedFields.avatar;
      if (updatedFields.bio) dbFields.bio = updatedFields.bio;
      if (updatedFields.phone) dbFields.phone = updatedFields.phone;
      if (updatedFields.weightClass) dbFields.weight_class = updatedFields.weightClass;
      if (updatedFields.discipline) dbFields.discipline = updatedFields.discipline;
      if (updatedFields.membership) dbFields.membership = updatedFields.membership;
      if (updatedFields.status) dbFields.status = updatedFields.status;

      updateProfileData(currentUser.id, dbFields);
    }
  };

  // Upload Avatar to Supabase Storage
  const uploadUserAvatar = async (file) => {
    if (isSupabaseConfigured && currentUser?.id && file) {
      const { url, error } = await uploadAvatar(currentUser.id, file);
      if (!error && url) {
        updateProfile({ avatar: url });
        return url;
      }
    }
    return null;
  };

  // ==========================================
  // TIMETABLE ADMIN ACTIONS
  // ==========================================

  const addScheduleClass = async (classData) => {
    const newEntry = {
      id: "sc-" + Date.now(),
      day: classData.day,
      time: classData.time,
      classTitle: classData.classTitle,
      trainer: classData.trainer,
      spotsLeft: Number(classData.total),
      total: Number(classData.total)
    };
    setSchedule((prev) => [newEntry, ...prev]);

    if (isSupabaseConfigured) {
      sbCreateClass(newEntry);
    }
  };

  const removeScheduleClass = async (classId) => {
    setSchedule((prev) => prev.filter((sc) => sc.id !== classId));
    if (isSupabaseConfigured) {
      sbDeleteClass(classId);
    }
  };

  return (
    <GymContext.Provider
      value={{
        isSupabaseConfigured,
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        programs,
        trainers,
        memberships,
        schedule,
        setSchedule,
        addScheduleClass,
        removeScheduleClass,
        bookings,
        adminBookings,
        bookClass,
        cancelBooking,
        purchasePlan,
        workoutLogs,
        addWorkoutLog,
        consultationRequests,
        addConsultationRequest,
        updateConsultationStatus,
        userNotifications,
        markNotificationsAsRead,
        createNotification,
        updateProfile,
        uploadUserAvatar,
        adminStats,
        setAdminStats
      }}
    >
      {children}
    </GymContext.Provider>
  );
}

export const useGym = () => {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error("useGym must be used inside GymProvider");
  return ctx;
};
