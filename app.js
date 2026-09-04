/**
 * Yurdunu Bil — app.js
 * v8.1.0
 *
 * Supabase:
 * - Auth
 * - Province progress
 * - Topic progress
 * - Quiz results
 * - Favorites
 * - Profile
 * - Full data reset
 *
 * LocalStorage:
 * - Offline/local fallback
 * - UI state
 * - Daily tasks
 * - Streak
 */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
  ========================================================= */

  const CFG = window.YURDUNUBIL_CONFIG || window.GEOKPSS_CONFIG || {};

  const USE_SUPABASE = Boolean(
    CFG.SUPABASE_URL &&
    CFG.SUPABASE_PUBLISHABLE_KEY &&
    window.supabase
  );

  let sb = null;

  if (USE_SUPABASE) {
    try {
      sb = window.supabase.createClient(
        CFG.SUPABASE_URL,
        CFG.SUPABASE_PUBLISHABLE_KEY,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          }
        }
      );
    } catch (error) {
      console.error("Supabase başlatılamadı:", error);
      sb = null;
    }
  }

  /* =========================================================
     DATA
  ========================================================= */

  const PROVINCES =
    Array.isArray(window.PROVINCE_DATA)
      ? window.PROVINCE_DATA
      : [];

  const PMAP =
    window.PROVINCE_BY_NAME instanceof Map
      ? window.PROVINCE_BY_NAME
      : new Map();

  const QUESTIONS =
    Array.isArray(window.QUESTION_BANK)
      ? window.QUESTION_BANK
      : [];

  const TOPICS =
    Array.isArray(window.TOPICS)
      ? window.TOPICS
      : [];

  const PLATE_MAP = new Map(
    PROVINCES
      .filter(p => p && p.plate != null)
      .map(p => [Number(p.plate), p])
  );

  /* =========================================================
     STATE
  ========================================================= */

  const DEFAULT_STATE = {
    discovered: [],
    favorites: [],
    topicPct: {},
    results: [],
    streak: [],
    profile: {
      displayName: "Öğrenci",
      email: ""
    },
    dailyDone: [],
    _dailyDate: null
  };

  let STATE = loadState();

  let currentUser = null;

  let fullMap = null;
  let dashMap = null;

  let geoLayer = null;
  let dashLayer = null;

  let geoCache = null;

  let mapMode = "default";
  let currentLibraryFilter = "all";

  let quizSession = null;

  let activeModal = null;

  let selectedProvinceName = null;

  const MAP_LEGENDS = {
    default: "Standart görünüm: keşfedilen iller yeşil, diğer iller bölgesel renkte.",
    agriculture: "Tarım görünümü: çay, zeytin, pamuk, üzüm, fındık ve kayısı öne çıkarılır.",
    climate: "İklim görünümü: Akdeniz, Karadeniz ve karasal iklim alanları renklendirilir.",
    terrain: "Arazi görünümü: dağ, ova ve plato vurgulanır.",
    mining: "Maden görünümü: bor, kömür, krom, petrol ve bakır öne çıkarılır."
  };

  /* =========================================================
     DOM HELPERS
  ========================================================= */

  const $ = id => document.getElementById(id);

  const QA = selector =>
    [...document.querySelectorAll(selector)];

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function norm(value) {
    return String(value || "")
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .trim();
  }

  function initials(name) {
    return String(name || "Öğrenci")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(x => x[0])
      .join("")
      .toLocaleUpperCase("tr-TR") || "?";
  }

  function todayStr() {
    return new Date().toLocaleDateString("en-CA");
  }

  function setText(id, value) {
    const element = $(id);
    if (element) {
      element.textContent = value;
    }
  }

  function setHTML(id, value) {
    const element = $(id);
    if (element) {
      element.innerHTML = value;
    }
  }

  function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function isRemoteSession() {
    return Boolean(sb && currentUser && !currentUser.demo && !currentUser.guest);
  }

  /* =========================================================
     LOCAL STORAGE
  ========================================================= */

  function cloneDefaultState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function loadState() {
    try {
      const raw =
        localStorage.getItem("yurdunubil_v1") ||
        localStorage.getItem("kpss_atlas_v2");

      if (!raw) {
        return cloneDefaultState();
      }

      const parsed = JSON.parse(raw);

      return {
        ...cloneDefaultState(),
        ...parsed,
        profile: {
          ...DEFAULT_STATE.profile,
          ...(parsed.profile || {})
        },
        topicPct: {
          ...(parsed.topicPct || {})
        },
        discovered: Array.isArray(parsed.discovered)
          ? parsed.discovered
          : [],
        favorites: Array.isArray(parsed.favorites)
          ? parsed.favorites
          : [],
        results: Array.isArray(parsed.results)
          ? parsed.results
          : [],
        streak: Array.isArray(parsed.streak)
          ? parsed.streak
          : [],
        dailyDone: Array.isArray(parsed.dailyDone)
          ? parsed.dailyDone
          : []
      };
    } catch (error) {
      console.warn("LocalStorage okunamadı:", error);
      return cloneDefaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        "yurdunubil_v1",
        JSON.stringify(STATE)
      );
    } catch (error) {
      console.warn("State kaydedilemedi:", error);
    }
  }

  /* =========================================================
     TOAST
  ========================================================= */

  function toast(message, type = "info") {
    const root = $("toast-root");

    if (!root) return;

    const element = document.createElement("div");

    element.className = `toast ${type}`;

    const icon =
      type === "success"
        ? "✓"
        : type === "error"
          ? "✕"
          : "i";

    element.innerHTML = `
      <span>${icon}</span>
      <div>${esc(message)}</div>
    `;

    root.appendChild(element);

    requestAnimationFrame(() => {
      element.classList.add("show");
    });

    setTimeout(() => {
      element.classList.remove("show");

      setTimeout(() => {
        element.remove();
      }, 350);
    }, 3400);
  }

  /* =========================================================
     AUTH SCREENS
  ========================================================= */

  /*
   * SCREEN GATE
   * Auth ve uygulama ekranını yalnızca class ile değil,
   * inline display + aria/inert ile de kilitliyoruz.
   * Böylece eski CSS/cache yüzünden auth katmanının uygulamanın
   * üzerinde kalması veya tıklamaları engellemesi mümkün olmaz.
   */
  let appMapsBooted = false;

  function setScreenVisibility(screen, visible) {
    if (!screen) return;

    screen.classList.toggle("hidden", !visible);
    screen.setAttribute("aria-hidden", String(!visible));

    if ("inert" in screen) {
      screen.inert = !visible;
    }

    screen.style.display = visible ? "" : "none";
    screen.style.pointerEvents = visible ? "" : "none";
  }

  function showAuthScreen(mode = "login") {
    setScreenVisibility($("auth-screen"), true);
    setScreenVisibility($("app-screen"), false);
    document.body.classList.add("auth-active");
    document.body.classList.remove("app-active");

    switchAuthTab(mode);

    const demoBadge = $("demo-badge");

    if (demoBadge) {
      demoBadge.style.display = sb ? "none" : "flex";
    }
  }

  function startGuestSession() {
    currentUser = {
      id: "guest-local",
      guest: true,
      demo: true
    };

    STATE.profile.displayName = STATE.profile.displayName || "Misafir";
    STATE.profile.email = "";
    saveState();
    showAppScreen();
    toast("Misafir modundasın. İlerlemen bu tarayıcıda saklanır.", "success");
  }

  function showAppScreen() {
    /*
     * Kritik sıra:
     * 1) Önce auth'u tamamen kaldır.
     * 2) Sonra app'i görünür ve tıklanabilir yap.
     * 3) Navigasyonu çalıştır.
     *
     * Böylece SIGNED_IN listener + doLogin aynı anda çalışsa bile
     * login ekranı uygulamanın üzerinde kalamaz.
     */
    setScreenVisibility($("auth-screen"), false);
    setScreenVisibility($("app-screen"), true);
    document.body.classList.remove("auth-active");
    document.body.classList.add("app-active");

    renderUserUI();
    updateStreak();
    navigate(getInitialView(), {history:false});

    if (!appMapsBooted) {
      appMapsBooted = true;
      setTimeout(() => {
        try {
          // Only initialize the visible map here. Leaflet must not be
          // measured inside a display:none page. The full map is created
          // lazily when the Map view becomes active.
          initDashboardMap();
          if (getInitialView() === "map") initFullMap();
        } catch (error) {
          console.warn("Harita başlatılamadı:", error);
        }
      }, 120);
    }
  }

  function switchAuthTab(mode) {
    QA(".auth-tab").forEach(button => {
      const active =
        button.dataset.auth === mode;

      button.classList.toggle(
        "active",
        active
      );

      button.setAttribute(
        "aria-selected",
        String(active)
      );
    });

    $("login-form-wrap")?.classList.toggle(
      "active",
      mode === "login"
    );

    $("register-form-wrap")?.classList.toggle(
      "active",
      mode !== "login"
    );

    clearFormErrors();
  }

  function getRequestedAuthMode() {
    return new URLSearchParams(location.search).get("auth") === "register"
      ? "register"
      : "login";
  }

  /* =========================================================
     AUTH HELPERS
  ========================================================= */

  function normalizeEmail(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function getAuthErrorMessage(error, action = "login") {
    const raw = String(error?.message || error || "").trim();
    const code = String(error?.code || "").toLowerCase();
    const status = Number(error?.status) || 0;

    const text = `${code} ${raw}`.toLowerCase();

    if (
      text.includes("invalid login credentials") ||
      text.includes("invalid credentials") ||
      text.includes("invalid email or password") ||
      text.includes("user not found")
    ) {
      return "E-posta adresi veya şifre hatalı.";
    }

    if (
      text.includes("email_not_confirmed") ||
      text.includes("email not confirmed")
    ) {
      return "E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et.";
    }

    if (
      text.includes("user already registered") ||
      text.includes("already registered") ||
      text.includes("already been registered") ||
      text.includes("user_already_exists")
    ) {
      return "Bu e-posta zaten kayıtlı. Giriş yapmayı dene.";
    }

    if (
      text.includes("password should be at least") ||
      text.includes("password must be at least")
    ) {
      return "Şifre Supabase'in belirlediği minimum uzunlukta olmalı.";
    }

    if (
      text.includes("rate limit") ||
      text.includes("too many requests") ||
      status === 429
    ) {
      return "Çok fazla deneme yapıldı. Biraz sonra tekrar dene.";
    }

    if (
      text.includes("failed to fetch") ||
      text.includes("fetch failed") ||
      text.includes("network")
    ) {
      return "Supabase'e bağlanılamadı. İnternet ve Render ayarlarını kontrol et.";
    }

    if (
      text.includes("redirect") ||
      text.includes("redirect_uri") ||
      text.includes("redirect url")
    ) {
      return "Supabase Auth yönlendirme adresi bu site için tanımlanmamış.";
    }

    if (
      text.includes("apikey") ||
      text.includes("api key") ||
      text.includes("invalid api key") ||
      text.includes("jwt")
    ) {
      return "Supabase bağlantı anahtarı geçersiz görünüyor.";
    }

    if (action === "register") {
      return raw || "Kayıt işlemi başarısız.";
    }

    return raw || "Giriş işlemi başarısız.";
  }

  async function applyRemoteSession(session, options = {}) {
    const user = session?.user || null;

    if (!user) {
      currentUser = null;
      return false;
    }

    currentUser = user;

    STATE.profile.displayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Öğrenci";

    STATE.profile.email =
      user.email || "";

    saveState();
    showAppScreen();

    if (options.sync !== false) {
      try {
        await syncFromSupabase();
        renderDashboard();
      } catch (error) {
        console.warn(
          "Supabase senkronizasyonu başarısız:",
          error
        );
      }
    }

    return true;
  }

  /* =========================================================
     AUTH OPERATIONS
  ========================================================= */

  async function doLogin(email, password) {
    if (!sb) {
      const normalizedEmail = normalizeEmail(email);

      const users = getLocalUsers();

      const found = users.find(user =>
        normalizeEmail(user.email) === normalizedEmail &&
        user.password === password
      );

      if (!found) {
        throw new Error("E-posta adresi veya şifre hatalı.");
      }

      currentUser = {
        id: found.id,
        email: found.email,
        demo: true
      };

      STATE.profile.displayName =
        found.name || found.email.split("@")[0];

      STATE.profile.email =
        found.email;

      saveState();
      showAppScreen();

      toast(
        "Hoş geldin! Çalışmaya devam. 🎯",
        "success"
      );

      return;
    }

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      throw new Error(
        "E-posta ve şifre zorunlu."
      );
    }

    const { data, error } =
      await sb.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

    if (error) {
      throw new Error(
        getAuthErrorMessage(error, "login")
      );
    }

    if (!data?.user) {
      throw new Error(
        "Giriş tamamlanamadı. Kullanıcı oturumu alınamadı."
      );
    }

    await applyRemoteSession(
      data.session,
      {
        sync: true
      }
    );

    toast(
      "Hoş geldin! Çalışmaya devam. 🎯",
      "success"
    );
  }

  async function doRegister(name, email, password) {
    if (!sb) {
      const normalizedEmail =
        normalizeEmail(email);

      const users = getLocalUsers();

      const exists = users.some(
        user =>
          normalizeEmail(user.email) ===
          normalizedEmail
      );

      if (exists) {
        throw new Error(
          "Bu e-posta zaten kayıtlı."
        );
      }

      const id =
        crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random()}`;

      users.push({
        id,
        name: String(name || "").trim() || "Öğrenci",
        email: normalizedEmail,
        password
      });

      localStorage.setItem(
        "yurdunubil_demo_users",
        JSON.stringify(users)
      );

      currentUser = {
        id,
        email: normalizedEmail,
        demo: true
      };

      STATE.profile.displayName =
        String(name || "").trim() ||
        "Öğrenci";

      STATE.profile.email =
        normalizedEmail;

      saveState();
      showAppScreen();

      toast(
        "Demo hesabın hazır! Hoş geldin. 🎉",
        "success"
      );

      return;
    }

    const normalizedEmail =
      normalizeEmail(email);

    const cleanName =
      String(name || "").trim();

    if (!cleanName) {
      throw new Error(
        "Ad soyad alanı zorunlu."
      );
    }

    if (!normalizedEmail) {
      throw new Error(
        "Geçerli bir e-posta adresi gir."
      );
    }

    if (!password || password.length < 6) {
      throw new Error(
        "Şifren en az 6 karakter olmalı."
      );
    }

    const { data, error } =
      await sb.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            display_name: cleanName
          },
          emailRedirectTo:
            location.origin +
            location.pathname
        }
      });

    if (error) {
      throw new Error(
        getAuthErrorMessage(error, "register")
      );
    }

    /*
     * Supabase email confirmation kapalıysa
     * session doğrudan gelir.
     */
    if (data?.session?.user) {
      await applyRemoteSession(
        data.session,
        {
          sync: true
        }
      );

      toast(
        "Hesabın hazır! Hoş geldin. 🚀",
        "success"
      );

      return;
    }

    /*
     * Email confirmation açıksa session gelmez.
     */
    toast(
      "Kayıt tamamlandı. E-posta adresini doğrulayıp giriş yap.",
      "success"
    );

    switchAuthTab("login");

    const loginEmail =
      $("login-email");

    if (loginEmail) {
      loginEmail.value =
        normalizedEmail;
    }
  }

  async function doLogout() {
    if (sb && currentUser && !currentUser.demo && !currentUser.guest) {
      try {
        await sb.auth.signOut();
      } catch (error) {
        console.warn(
          "Supabase çıkış hatası:",
          error
        );
      }
    }

    currentUser = null;
    STATE = cloneDefaultState();

    saveState();
    destroyMaps();
    appMapsBooted = false;

    showAuthScreen("login");

    toast(
      "Oturum kapatıldı."
    );
  }

  async function doForgotPassword() {
    const email =
      normalizeEmail(
        $("login-email")?.value
      );

    if (!email) {
      toast(
        "Önce e-posta adresini yaz.",
        "error"
      );
      return;
    }

    if (!sb) {
      toast(
        "Şifre sıfırlama gerçek Supabase hesabı gerektirir.",
        "info"
      );
      return;
    }

    const { error } =
      await sb.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            location.origin +
            location.pathname
        }
      );

    if (error) {
      toast(
        getAuthErrorMessage(
          error,
          "login"
        ),
        "error"
      );
      return;
    }

    toast(
      "Şifre sıfırlama bağlantısı e-posta adresine gönderildi.",
      "success"
    );
  }

  async function doGoogleLogin() {
    if (!sb) {
      toast(
        "Google girişi için Supabase bağlantısı gerekiyor.",
        "info"
      );
      return;
    }

    const { error } =
      await sb.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            location.origin +
            location.pathname
        }
      });

    if (error) {
      toast(
        getAuthErrorMessage(
          error,
          "login"
        ),
        "error"
      );
    }
  }
  /* =========================================================
     SUPABASE HELPERS
  ========================================================= */

  function normalizeRemoteResult(result) {
    const total =
      Number(result?.total) || 0;

    const correct =
      Number(result?.correct) || 0;

    const pct =
      result?.score != null
        ? Number(result.score)
        : total > 0
          ? Math.round(
              (correct / total) * 100
            )
          : 0;

    return {
      id: result?.id,
      date:
        result?.created_at ||
        "",
      total,
      correct,
      wrong: Math.max(
        0,
        total - correct
      ),
      topicId:
        result?.topic_id ||
        "mixed",
      pct
    };
  }

  function favoriteParts(key) {
    const value = String(key || "");

    if (value.startsWith("topic:")) {
      return {
        itemType: "topic",
        itemId: value.slice(6)
      };
    }

    return {
      itemType: "province",
      itemId: value
    };
  }

  /* =========================================================
     SUPABASE SYNC FROM SERVER
  ========================================================= */

  async function syncFromSupabase() {
    if (!isRemoteSession()) {
      return;
    }

    const uid = currentUser.id;

    try {
      const [
        provinceResponse,
        topicResponse,
        resultResponse,
        favoriteResponse,
        profileResponse
      ] = await Promise.all([
        sb
          .from("province_progress")
          .select("province_name")
          .eq("user_id", uid)
          .eq("visited", true),

        sb
          .from("topic_progress")
          .select("topic_id,progress")
          .eq("user_id", uid),

        sb
          .from("quiz_results")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", {
            ascending: false
          })
          .limit(100),

        sb
          .from("favorites")
          .select("item_id,item_type")
          .eq("user_id", uid),

        sb
          .from("profiles")
          .select("display_name")
          .eq("id", uid)
          .maybeSingle()
      ]);

      /* Province */

      if (
        !provinceResponse.error &&
        Array.isArray(
          provinceResponse.data
        )
      ) {
        STATE.discovered =
          provinceResponse.data
            .map(row =>
              norm(row.province_name)
            )
            .filter(Boolean);
      } else if (
        provinceResponse.error
      ) {
        console.warn(
          "Province sync:",
          provinceResponse.error
        );
      }

      /* Topic */

      if (
        !topicResponse.error &&
        Array.isArray(topicResponse.data)
      ) {
        const topicPct = {};

        topicResponse.data.forEach(
          row => {
            if (!row.topic_id) return;

            topicPct[row.topic_id] =
              Math.max(
                0,
                Math.min(
                  100,
                  Number(row.progress) || 0
                )
              );
          }
        );

        STATE.topicPct = topicPct;

      } else if (
        topicResponse.error
      ) {
        console.warn(
          "Topic sync:",
          topicResponse.error
        );
      }

      /* Quiz results */

      if (
        !resultResponse.error &&
        Array.isArray(resultResponse.data)
      ) {
        STATE.results =
          resultResponse.data.map(
            normalizeRemoteResult
          );
      } else if (
        resultResponse.error
      ) {
        console.warn(
          "Quiz sync:",
          resultResponse.error
        );
      }

      /* Favorites */

      if (
        !favoriteResponse.error &&
        Array.isArray(
          favoriteResponse.data
        )
      ) {
        STATE.favorites =
          favoriteResponse.data
            .map(row => {
              const type =
                row.item_type ||
                "province";

              if (type === "topic") {
                return `topic:${row.item_id}`;
              }

              return norm(row.item_id);
            })
            .filter(Boolean);
      } else if (
        favoriteResponse.error
      ) {
        console.warn(
          "Favorite sync:",
          favoriteResponse.error
        );
      }

      /* Profile */

      if (
        !profileResponse.error &&
        profileResponse.data?.display_name
      ) {
        STATE.profile.displayName =
          profileResponse.data.display_name;
      } else if (
        profileResponse.error
      ) {
        console.warn(
          "Profile sync:",
          profileResponse.error
        );
      }

      /* Email auth.users'dan geliyor */

      STATE.profile.email =
        currentUser.email ||
        STATE.profile.email ||
        "";

      saveState();

    } catch (error) {
      console.warn(
        "Supabase genel senkronizasyon hatası:",
        error
      );
    }
  }

  /* =========================================================
     SUPABASE PUSH — PROVINCE
  ========================================================= */

  async function pushDiscovered(provinceName) {
    if (!isRemoteSession()) {
      return;
    }

    const { error } =
      await sb
        .from("province_progress")
        .upsert(
          {
            user_id: currentUser.id,
            province_name:
              norm(provinceName),
            visited: true,
            updated_at:
              new Date().toISOString()
          },
          {
            onConflict:
              "user_id,province_name"
          }
        );

    if (error) {
      console.warn(
        "İl ilerlemesi kaydedilemedi:",
        error
      );
    }
  }

  /* =========================================================
     SUPABASE PUSH — TOPIC
  ========================================================= */

  async function pushTopicProgress(
    topicId,
    progress
  ) {
    if (!isRemoteSession() || !topicId) {
      return;
    }

    const safeProgress = Math.max(
      0,
      Math.min(
        100,
        Number(progress) || 0
      )
    );

    const { error } =
      await sb
        .from("topic_progress")
        .upsert(
          {
            user_id: currentUser.id,
            topic_id: topicId,
            progress: safeProgress,
            updated_at:
              new Date().toISOString()
          },
          {
            onConflict:
              "user_id,topic_id"
          }
        );

    if (error) {
      console.warn(
        "Konu ilerlemesi kaydedilemedi:",
        error
      );
    }
  }

  /* =========================================================
     SUPABASE PUSH — QUIZ RESULT
  ========================================================= */

  async function pushResult(result) {
    if (!isRemoteSession()) {
      return;
    }

    const total =
      Number(result?.total) || 0;

    const correct =
      Number(result?.correct) || 0;

    const score =
      result?.pct != null
        ? Number(result.pct)
        : total > 0
          ? Math.round(
              (correct / total) * 100
            )
          : 0;

    const { error } =
      await sb
        .from("quiz_results")
        .insert({
          user_id: currentUser.id,
          topic_id:
            result.topicId ||
            "mixed",
          correct,
          total,
          score,
          created_at:
            new Date().toISOString()
        });

    if (error) {
      console.warn(
        "Quiz sonucu kaydedilemedi:",
        error
      );
    }
  }

  /* =========================================================
     SUPABASE PUSH — FAVORITE
  ========================================================= */

  async function pushFavorite(
    key,
    shouldFavorite
  ) {
    if (!isRemoteSession()) {
      return;
    }

    const {
      itemType,
      itemId
    } = favoriteParts(key);

    if (
      !itemId ||
      !itemType
    ) {
      return;
    }

    if (shouldFavorite) {
      const { error } =
        await sb
          .from("favorites")
          .upsert(
            {
              user_id:
                currentUser.id,
              item_type:
                itemType,
              item_id:
                itemId
            },
            {
              onConflict:
                "user_id,item_type,item_id"
            }
          );

      if (error) {
        throw error;
      }

    } else {
      const { error } =
        await sb
          .from("favorites")
          .delete()
          .eq(
            "user_id",
            currentUser.id
          )
          .eq(
            "item_type",
            itemType
          )
          .eq(
            "item_id",
            itemId
          );

      if (error) {
        throw error;
      }
    }
  }

  /* =========================================================
     USER UI
  ========================================================= */

  function renderUserUI() {
    const name =
      STATE.profile.displayName ||
      "Öğrenci";

    const email =
      STATE.profile.email ||
      (isRemoteSession() ? "" : "Yerel mod");

    const avatar =
      initials(name);

    setText(
      "sidebar-username",
      name
    );

    setText(
      "sidebar-usersub",
      isRemoteSession()
        ? "Senkronize hesap"
        : currentUser?.guest ? "Misafir modu" : "Yerel mod"
    );

    setHTML(
      "sidebar-avatar",
      avatar
    );

    setText(
      "topbar-username",
      name
    );

    setHTML(
      "topbar-avatar",
      avatar
    );

    setText(
      "welcome-name",
      name.split(" ")[0]
    );

    setHTML(
      "settings-avatar",
      avatar
    );

    setText(
      "settings-displayname",
      name
    );

    setText(
      "settings-email",
      email || (currentUser?.guest ? "Misafir oturumu" : "Yerel hesap")
    );

    setHTML(
      "dropdown-avatar",
      avatar
    );

    setText(
      "dropdown-name",
      name
    );

    setText(
      "dropdown-email",
      email || (currentUser?.guest ? "Misafir oturumu" : "Yerel hesap")
    );

    const nameInput =
      $("settings-name-input");

    if (nameInput) {
      nameInput.value = name;
    }

    const datePill =
      $("date-pill");

    if (datePill) {
      datePill.textContent =
        new Date().toLocaleDateString(
          "tr-TR",
          {
            weekday: "long",
            day: "numeric",
            month: "long"
          }
        );
    }

    const sessionNote =
      $("settings-session-note");

    if (sessionNote) {
      sessionNote.innerHTML = isRemoteSession()
        ? "Senkronize hesap modundasın — verilerin güvenle cihazlar arasında eşitlenir."
        : "Yerel moddasın — ilerlemen yalnızca bu tarayıcıda saklanır. İstersen hesap oluşturarak cihazlar arasında eşitleyebilirsin.";
    }
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function navigate(viewId, options = {}) {
    const appScreen = $("app-screen");
    if (!appScreen || appScreen.classList.contains("hidden") || appScreen.getAttribute("aria-hidden") === "true") return false;
    const target = $(`view-${viewId}`);
    if (!target) { console.warn(`Yurdunu Bil: "${viewId}" görünümü bulunamadı.`); return false; }

    QA(".nav-item[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === viewId));
    QA(".mobile-bottom-nav [data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === viewId));
    QA(".view").forEach(view => {
      const active = view === target;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", String(!active));
      view.inert = !active;
    });

    const titles = {dashboard:"Genel Bakış",map:"Türkiye Haritası",topics:"Konu Kütüphanesi",library:"Çalışma Kütüphanesi",quiz:"Mini Test",stats:"İstatistikler",favorites:"Favoriler",settings:"Ayarlar & Profil"};
    setText("page-title", titles[viewId] || viewId);

    if (options.history !== false) {
      const hash = `#${viewId}`;
      if (location.hash !== hash) history.pushState({view:viewId}, "", hash);
    }

    // Every section opens from a predictable position; no accidental jump to dashboard.
    const scroller = document.querySelector('.main-content');
    if (options.preserveScroll !== true) {
      if (scroller) scroller.scrollTo({top:0, behavior:'smooth'});
      else window.scrollTo({top:0, behavior:'smooth'});
    }

    if (viewId === "dashboard") renderDashboard();
    if (viewId === "topics") renderTopics();
    if (viewId === "library") renderLibrary(currentLibraryFilter || "all");
    if (viewId === "stats") renderStats();
    if (viewId === "favorites") renderFavorites();
    if (viewId === "quiz" && !quizSession) resetQuizShell();
    if (viewId === "map") {
      // The map page is normally hidden until navigation. Initialize Leaflet
      // after the page becomes active, then recalculate its size a few times
      // to cover fonts/layout transitions on desktop and mobile.
      setTimeout(() => {
        try { initFullMap(); } catch (error) {
          console.warn("Türkiye haritası başlatılamadı:", error);
        }
        try { fullMap?.invalidateSize({pan:false}); } catch {}
      }, 0);
      [120, 350, 800].forEach(ms => setTimeout(() => {
        try { fullMap?.invalidateSize({pan:false}); } catch {}
      }, ms));
    } else if (viewId === "dashboard") {
      [80, 300].forEach(ms => setTimeout(() => {
        try { dashMap?.invalidateSize({pan:false}); } catch {}
      }, ms));
    }
    closeSidebar();
    closeProfileDropdown();
    return true;
  }

  /* =========================================================
     DAILY STREAK
  ========================================================= */

  function updateStreak() {
    const today = todayStr();
    const entries = Array.isArray(STATE.streak) ? STATE.streak : [];
    const unique = [...new Set(entries.filter(value => /^\d{4}-\d{2}-\d{2}$/.test(String(value))))];
    if (!unique.includes(today)) unique.push(today);
    STATE.streak = unique.sort().slice(-365);
    saveState();
  }

  function getStreakCount() {
    const entries = new Set(Array.isArray(STATE.streak) ? STATE.streak : []);
    let cursor = new Date();
    let count = 0;
    while (entries.has(cursor.toLocaleDateString("en-CA"))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function renderStreakDays(id) {
    const container = $(id);
    if (!container) return;
    const entries = new Set(Array.isArray(STATE.streak) ? STATE.streak : []);
    const days = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      const key = date.toLocaleDateString("en-CA");
      days.push(`<i class="${entries.has(key) ? "on" : ""}" aria-label="${esc(date.toLocaleDateString("tr-TR", { weekday: "short" }))}"></i>`);
    }
    container.innerHTML = days.join("");
  }

  function getInitialView() {
    const value = (location.hash || '').replace('#','').trim();
    return $("view-" + value) ? value : 'dashboard';
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  function renderDashboard() {
    const total =
      STATE.results.reduce(
        (sum, result) =>
          sum +
          (Number(result.total) || 0),
        0
      );

    const correct =
      STATE.results.reduce(
        (sum, result) =>
          sum +
          (Number(result.correct) || 0),
        0
      );

    const accuracy =
      total > 0
        ? Math.round(
            (correct / total) * 100
          )
        : null;

    const streak =
      getStreakCount();

    const discovered =
      STATE.discovered.length;

    setText(
      "dash-discovered",
      discovered
    );

    setText(
      "dash-questions",
      total
    );

    setText(
      "dash-accuracy",
      accuracy !== null
        ? `%${accuracy}`
        : "—"
    );

    setText(
      "dash-accuracy-ring",
      accuracy !== null
        ? `%${accuracy}`
        : "—"
    );

    setText(
      "dash-streak",
      streak
    );

    const bar =
      $("dash-discovered-bar");

    if (bar) {
      bar.style.width =
        `${Math.min(
          100,
          Math.round(
            (discovered / 81) * 100
          )
        )}%`;
    }

    renderStreakDays(
      "streak-days"
    );

    renderStudyList();

    renderTopicBars(
      "dashboard-topic-bars"
    );
  }

  function renderStudyList() {
    const container =
      $("study-list");

    if (!container) return;

    const today =
      todayStr();

    if (
      STATE._dailyDate !==
      today
    ) {
      STATE._dailyDate =
        today;

      STATE.dailyDone = [];

      saveState();
    }

    const tasks = [
      {
        id: "map3",
        icon: "🗺️",
        title:
          "3 yeni il keşfet",
        meta:
          "Haritaya git → tıkla",
        view: "map"
      },
      {
        id: "quiz5",
        icon: "âœï¸",
        title:
          "Mini test çöz",
        meta:
          "5 soruluk test",
        view: "quiz"
      },
      {
        id: "topic1",
        icon: "ğŸ“š",
        title:
          "Bir konu kartı aç",
        meta:
          "Konu kütüphanesini gez",
        view: "topics"
      }
    ];

    const done =
      STATE.dailyDone || [];

    container.innerHTML =
      tasks.map(task => {
        const isDone =
          done.includes(
            task.id
          );

        return `
          <div
            class="study-item${isDone ? " done" : ""}"
            data-view="${esc(task.view)}"
            data-task="${esc(task.id)}"
            role="listitem"
          >
            <div class="study-check">
              ${isDone ? "✓" : ""}
            </div>

            <div class="study-body">
              <div class="study-title">
                ${task.icon}
                ${esc(task.title)}
              </div>

              <div class="study-meta">
                ${esc(task.meta)}
              </div>
            </div>
          </div>
        `;
      }).join("");

    setText(
      "daily-count",
      `${done.length}/3`
    );

    container
      .querySelectorAll(
        ".study-item"
      )
      .forEach(element => {
        element.addEventListener(
          "click",
          () => {
            if (!STATE.dailyDone) {
              STATE.dailyDone = [];
            }

            if (
              !STATE.dailyDone.includes(
                element.dataset.task
              )
            ) {
              STATE.dailyDone.push(
                element.dataset.task
              );

              saveState();
            }

            navigate(
              element.dataset.view
            );
          }
        );
      });
  }

  function renderTopicBars(
    containerId
  ) {
    const element =
      $(containerId);

    if (!element) return;

    element.innerHTML =
      TOPICS.map(topic => {
        const pct =
          Number(
            STATE.topicPct?.[
              topic.id
            ]
          ) || 0;

        return `
          <div class="topic-bar-row">
            <div class="topic-bar-label">
              <span><i class="topic-progress-icon">${topic.icon}</i><strong>${esc(topic.title)}</strong></span>
              <b>%${pct}</b>
            </div>
            <div class="topic-bar-track"><div class="topic-bar-fill" style="width:${pct}%"></div></div>
            <small>${pct === 0 ? 'Başlamadı' : pct < 50 ? 'Temel atılıyor' : pct < 100 ? 'İlerliyorsun' : 'Tamamlandı'}</small>
          </div>
        `;
      }).join("");
  }

  /* =========================================================
     GEOJSON
  ========================================================= */

  async function loadGeoJSON() {
    if (geoCache) {
      return geoCache;
    }

    if (location.protocol === "file:") {
      throw new Error("Site doğrudan dosyaya çift tıklanarak açılmış. GeoJSON için Live Server veya bir web sunucusu ile açın.");
    }

    const response =
      await fetch(
        "data/provinces.geojson",
        {
          cache: "no-cache"
        }
      );

    if (!response.ok) {
      throw new Error(
        `GeoJSON HTTP ${response.status}`
      );
    }

    const json =
      await response.json();

    if (
      !json?.features?.length
    ) {
      throw new Error(
        "GeoJSON boş"
      );
    }

    geoCache = json;

    return json;
  }

  function getProvinceData(
    feature
  ) {
    const properties =
      feature?.properties ||
      {};

    if (
      properties.id &&
      /^TR-P-\d+$/.test(
        properties.id
      )
    ) {
      const plate =
        parseInt(
          properties.id.replace(
            "TR-P-",
            ""
          ),
          10
        );

      const data =
        PLATE_MAP.get(
          plate
        );

      if (data) {
        return data;
      }
    }

    const raw =
      properties.name ||
      properties.NAME ||
      properties.Name ||
      properties.adi ||
      properties.ADI ||
      properties.il ||
      properties.IL ||
      properties.province ||
      properties.PROVINCE ||
      "";

    if (!raw) {
      return null;
    }

    return (
      PMAP.get(
        norm(raw)
      ) || null
    );
  }

  function getProvinceName(
    feature
  ) {
    const data =
      getProvinceData(
        feature
      );

    if (data) {
      return data.name;
    }

    const properties =
      feature?.properties ||
      {};

    return (
      properties.name ||
      properties.NAME ||
      properties.adi ||
      properties.il ||
      properties.province ||
      "Bilinmeyen İl"
    );
  }

  /* =========================================================
     MAP COLORS
  ========================================================= */

  function provinceColor(
    feature
  ) {
    const data =
      getProvinceData(
        feature
      );

    if (!data) {
      return "#1a3550";
    }

    const discovered =
      STATE.discovered.includes(
        norm(data.name)
      );

    if (
      mapMode ===
      "default"
    ) {
      return discovered
        ? "#1a6645"
        : (
            data.color ||
            "#1e3f5c"
          );
    }

    if (
      mapMode ===
      "agriculture"
    ) {
      const agriculture =
        String(
          data.agriculture ||
          ""
        ).toLocaleLowerCase(
          "tr-TR"
        );

      if (
        agriculture.includes("çay")
      ) return "#0f9e6a";

      if (
        agriculture.includes(
          "zeytin"
        )
      ) return "#7db53a";

      if (
        agriculture.includes(
          "pamuk"
        )
      ) return "#7ab8d9";

      if (
        agriculture.includes(
          "üzüm"
        )
      ) return "#8b52c4";

      if (
        agriculture.includes(
          "fındık"
        )
      ) return "#b87333";

      if (
        agriculture.includes(
          "kayısı"
        ) ||
        agriculture.includes(
          "kayisi"
        )
      ) return "#e8860a";

      return "#2a4a6b";
    }

    if (
      mapMode ===
      "climate"
    ) {
      const climate =
        String(
          data.climate ||
          ""
        ).toLocaleLowerCase(
          "tr-TR"
        );

      if (
        climate.includes(
          "akdeniz"
        )
      ) return "#d4881a";

      if (
        climate.includes(
          "karadeniz"
        )
      ) return "#1e9957";

      if (
        climate.includes(
          "karasal"
        )
      ) return "#b83030";

      return "#2c5f8a";
    }

    if (
      mapMode ===
      "terrain"
    ) {
      const terrain =
        String(
          data.terrain ||
          ""
        ).toLocaleLowerCase(
          "tr-TR"
        );

      if (
        terrain.includes("dağ") ||
        terrain.includes("dag")
      ) return "#7e3db5";

      if (
        terrain.includes(
          "ova"
        )
      ) return "#1ea866";

      if (
        terrain.includes(
          "plato"
        )
      ) return "#c96010";

      return "#2c5f8a";
    }

    if (
      mapMode ===
      "mining"
    ) {
      const mining =
        String(
          data.mining ||
          ""
        ).toLocaleLowerCase(
          "tr-TR"
        );

      if (
        mining.includes("bor")
      ) return "#c8960a";

      if (
        mining.includes(
          "kömür"
        ) ||
        mining.includes(
          "komur"
        )
      ) return "#607080";

      if (
        mining.includes("krom")
      ) return "#7e3db5";

      if (
        mining.includes(
          "petrol"
        )
      ) return "#c0391c";

      if (
        mining.includes(
          "bakır"
        ) ||
        mining.includes(
          "bakir"
        )
      ) return "#c05818";

      return "#2a4a6b";
    }

    return (
      data.color ||
      "#1e3f5c"
    );
  }

  function provinceStyle(
    feature
  ) {
    return {
      color: "rgba(100,190,255,.22)",
      weight: 0.8,
      fillColor: provinceColor(feature),
      fillOpacity: 0.72,
      opacity: 1
    };
  }

  function provinceStyleHighlight(feature) {
    return {
      color: "#62d9ff",
      weight: 2.4,
      fillColor: provinceColor(feature),
      fillOpacity: 0.92,
      opacity: 1
    };
  }

  /* =========================================================
     MAP TILE LAYERS
     Google Maps / Mapbox API anahtarı kullanılmaz.
     Önce CARTO dark, hata olursa OSM.
  ========================================================= */

  function addReliableTiles(map, options = {}) {
    if (!map || typeof L === "undefined") return null;

    const withLabels = options.withLabels !== false;

    // CARTO dark matter — en iyi görünüm
    const cartoDark = withLabels
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";

    const primary = L.tileLayer(cartoDark, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
      detectRetina: true,
      crossOrigin: true
    });

    primary.addTo(map);

    // Hata olursa OSM'ye düş
    let fallbackStarted = false;
    primary.on("tileerror", () => {
      if (fallbackStarted || !map.hasLayer(primary)) return;
      fallbackStarted = true;
      map.removeLayer(primary);
      const fallback = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
        crossOrigin: true
      });
      fallback.addTo(map);
    });

    return primary;
  }

  /* =========================================================
     3D GLOW OVERLAY — harita üzerinde animasyonlu efektler
  ========================================================= */
  function addMapGlowEffects(mapInstance) {
    if (!mapInstance || typeof L === "undefined") return;

    // Harita container'ına 3D perspektif CSS ekle
    const container = mapInstance.getContainer();
    if (!container) return;

    // Parıltı katmanı (canvas overlay)
    const glowDiv = document.createElement("div");
    glowDiv.className = "yb-map-glow-overlay";
    glowDiv.setAttribute("aria-hidden", "true");
    container.appendChild(glowDiv);

    // Kenar efekti
    const edgeDiv = document.createElement("div");
    edgeDiv.className = "yb-map-edge-overlay";
    edgeDiv.setAttribute("aria-hidden", "true");
    container.appendChild(edgeDiv);
  }

  /* =========================================================
     FULL MAP
  ========================================================= */

  function initFullMap() {
    if (fullMap) {
      return;
    }

    const element =
      $("full-map");

    if (
      !element ||
      typeof L ===
        "undefined"
    ) {
      return;
    }

    fullMap =
      L.map(
        element,
        {
          center: [39, 35.5],
          zoom: 6,
          minZoom: 5,
          maxZoom: 11,
          zoomControl: false,
          preferCanvas: true,
          renderer: L.canvas({ padding: 0.5 })
        }
      );

    addReliableTiles(fullMap, { withLabels: true });
    addMapGlowEffects(fullMap);

    L.control.zoom({ position: "bottomright" }).addTo(fullMap);
    L.control.scale({ position: "bottomleft", imperial: false }).addTo(fullMap);

    loadGeoJSON()
      .then(geo => {
        geoLayer =
          L.geoJSON(
            geo,
            {
              style:
                provinceStyle,

              onEachFeature:
                (
                  feature,
                  layer
                ) =>
                  setupProvinceLayer(
                    feature,
                    layer
                  )
            }
          ).addTo(
            fullMap
          );

        if (
          geoLayer.getBounds()
            .isValid()
        ) {
          fullMap.fitBounds(
            geoLayer.getBounds(),
            {
              padding: [
                24,
                24
              ]
            }
          );
        }

        const status =
          $("map-status");

        if (status) {
          status.classList.add(
            "hide"
          );
        }

        updateMapLegend();
        populateProvinceOptions();

        const requestedProvince = new URLSearchParams(location.search).get("il");
        if (requestedProvince) {
          setTimeout(() => searchProvince(requestedProvince), 150);
        }
      })
      .catch(error => {
        const status =
          $("map-status");

        if (!status) {
          return;
        }

        status.innerHTML = `
          <div
            style="
              text-align:center;
              padding:24px;
            "
          >
            <div
              style="
                font-size:32px;
                margin-bottom:12px;
              "
            >
              ⚠ï¸
            </div>

            <strong
              style="color:var(--red)"
            >
              Harita yüklenemedi
            </strong>

            <br>

            <small
              style="color:var(--text3)"
            >
              ${esc(error.message)}
            </small>

            <br>

            <button id="map-retry-btn"
              style="
                margin-top:12px;
                padding:8px 16px;
                background:var(--surface2);
                border:1px solid var(--border2);
                border-radius:8px;
                color:var(--text);
                cursor:pointer;
              "
            >
              Yenile
            </button>
          </div>
        `;

        status.querySelector("#map-retry-btn")?.addEventListener("click", () => location.reload());
      });
  }

  /* =========================================================
     DASHBOARD MINI MAP
  ========================================================= */

  function initDashboardMap() {
    if (dashMap) {
      return;
    }

    const element =
      $("dashboard-map");

    if (
      !element ||
      typeof L ===
        "undefined"
    ) {
      return;
    }

    dashMap =
      L.map(
        element,
        {
          center: [
            39,
            35.5
          ],
          zoom: 5,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false,
          dragging: false,
          preferCanvas: true
        }
      );

    addReliableTiles(dashMap, { withLabels: false });

    loadGeoJSON()
      .then(geo => {
        dashLayer =
          L.geoJSON(
            geo,
            {
              style:
                provinceStyle,

              onEachFeature:
                (feature, layer) => {
                  layer.on({
                    mouseover(event) {
                      if (window.innerWidth <= 768) return;
                      event.target.setStyle({ fillOpacity: 0.88, weight: 1.5 });
                      event.target.bringToFront();
                    },
                    mouseout(event) {
                      if (dashLayer) dashLayer.resetStyle(event.target);
                    },
                    click() {
                      const name = getProvinceName(feature);
                      markDiscovered(norm(name));
                      navigate("map");
                      setTimeout(() => {
                        if (!geoLayer) return;
                        geoLayer.eachLayer(fullLayer => {
                          if (norm(getProvinceName(fullLayer.feature)) === norm(name)) {
                            fullMap?.flyToBounds(fullLayer.getBounds(), { maxZoom: 8, duration: 0.8 });
                            renderProvinceDetail(name);
                          }
                        });
                      }, 180);
                    }
                  });
                }
            }
          ).addTo(
            dashMap
          );

        if (
          dashLayer.getBounds()
            .isValid()
        ) {
          dashMap.fitBounds(
            dashLayer.getBounds(),
            {
              padding: [
                6,
                6
              ]
            }
          );
        }
      })
      .catch(error => {
        console.warn(
          "Mini harita yüklenemedi:",
          error
        );
      });
  }

  function destroyMaps() {
    if (fullMap) {
      fullMap.remove();
      fullMap = null;
      geoLayer = null;
    }

    if (dashMap) {
      dashMap.remove();
      dashMap = null;
      dashLayer = null;
    }

    geoCache = null;
  }

  /* =========================================================
     PROVINCE LAYER
  ========================================================= */

  function setupProvinceLayer(
    feature,
    layer
  ) {
    const name =
      getProvinceName(
        feature
      );

    layer.on({
      mouseover(event) {
        if (window.innerWidth <= 768) return;

        event.target.setStyle(provinceStyleHighlight(feature));
        event.target.bringToFront();

        const data = getProvinceData(feature);
        const discovered = data && STATE.discovered.includes(norm(data.name));
        const tooltipContent = `
          <div class="yb-tooltip">
            <strong>${esc(name)}</strong>
            ${data ? `<span class="yb-tooltip-region">${esc(data.region)}</span>` : ""}
            ${discovered ? `<span class="yb-tooltip-badge">✓ Keşfedildi</span>` : ""}
          </div>
        `;

        layer.bindTooltip(tooltipContent, {
          direction: "top",
          className: "province-tooltip yb-province-tooltip",
          offset: [0, -6],
          sticky: true
        }).openTooltip(event.latlng);
      },

      mouseout(event) {
        if (geoLayer) geoLayer.resetStyle(event.target);
        layer.closeTooltip();
      },

      click() {
        markDiscovered(norm(name));

        selectedProvinceName = name;
        const url = new URL(location.href);
        url.searchParams.set("il", name);
        url.hash = "map";
        history.replaceState({ view: "map" }, "", url);
        const search = $("province-search");
        if (search) search.value = name;

        if (fullMap) {
          fullMap.flyToBounds(layer.getBounds(), {
            maxZoom: 8,
            duration: 0.8,
            easeLinearity: 0.35,
            padding: [40, 40]
          });
        }

        renderProvinceDetail(name);

        // Pulse animasyonu — seçilen ile parıldama efekti
        event?.target?.setStyle({ color: "#62d9ff", weight: 2.8 });
        setTimeout(() => {
          if (geoLayer) geoLayer.setStyle(provinceStyle);
        }, 800);
      }
    });
  }

  /* =========================================================
     DISCOVERED
  ========================================================= */

  function markDiscovered(
    nameNorm
  ) {
    const normalized =
      norm(nameNorm);

    if (!normalized) {
      return;
    }

    if (
      STATE.discovered.includes(
        normalized
      )
    ) {
      return;
    }

    STATE.discovered.push(
      normalized
    );

    saveState();

    pushDiscovered(
      normalized
    );

    const province =
      PROVINCES.find(
        item =>
          norm(item.name) ===
          normalized
      );

    const friendly =
      province?.name ||
      nameNorm;

    toast(
      `${friendly} keşfedildi! 🗺️`,
      "success"
    );

    if (geoLayer) geoLayer.setStyle(provinceStyle);
    if (dashLayer) dashLayer.setStyle(provinceStyle);

    if (
      $("view-dashboard")
        ?.classList.contains(
          "active"
        )
    ) {
      renderDashboard();
    }

    if (
      STATE.discovered.length >=
      3
    ) {
      if (
        !STATE.dailyDone.includes(
          "map3"
        )
      ) {
        STATE.dailyDone.push(
          "map3"
        );

        saveState();
      }
    }
  }

  /* =========================================================
     PROVINCE DETAIL
  ========================================================= */

  function renderProvinceDetail(
    name
  ) {
    const panel =
      $("province-detail");

    if (!panel) {
      return;
    }

    const data =
      PMAP.get(norm(name)) ||
      PROVINCES.find(
        province =>
          norm(province.name) ===
          norm(name)
      );

    if (!data) {
      panel.innerHTML = `
        <div class="empty-detail">
          <div
            class="empty-globe"
            style="
              font-size:40px;
              opacity:.3
            "
          >
            ğŸ”
          </div>

          <h3>${esc(name)}</h3>

          <p>
            Veri bulunamadı.
          </p>
        </div>
      `;

      return;
    }

    const nameNorm =
      norm(data.name);

    const discovered =
      STATE.discovered.includes(
        nameNorm
      );

    const favorite =
      STATE.favorites.includes(
        nameNorm
      );

    panel.innerHTML = `
      <div class="province-info">

        <div class="province-info-header">

          <div>
            <div class="province-name">
              ${esc(data.name)}
            </div>

            <div class="province-plate">
              Plaka:
              <strong>
                ${esc(data.plate)}
              </strong>
            </div>
          </div>

          <div class="province-region-badge">
            ${esc(data.region)}
          </div>

        </div>

        <div class="kpss-box">

          <div class="kpss-box-label">

            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="var(--yellow)"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>

            KPSS NOTU

          </div>

          <p>
            ${esc(data.kpss)}
          </p>

        </div>

        <div class="fact-grid">

          <div class="fact-cell">
            <div class="fact-cell-label">
              🌦️ İklim
            </div>
            <p>
              ${esc(data.climate)}
            </p>
          </div>

          <div class="fact-cell">
            <div class="fact-cell-label">
              🌾 Tarım
            </div>
            <p>
              ${esc(data.agriculture)}
            </p>
          </div>

          <div class="fact-cell">
            <div class="fact-cell-label">
              ⛏️ Maden
            </div>
            <p>
              ${esc(data.mining)}
            </p>
          </div>

          <div class="fact-cell">
            <div class="fact-cell-label">
              ⛰️ Arazi
            </div>
            <p>
              ${esc(data.terrain)}
            </p>
          </div>

          <div class="fact-cell">
            <div class="fact-cell-label">
              💧 Akarsu
            </div>
            <p>
              ${esc(data.rivers)}
            </p>
          </div>

          <div class="fact-cell">
            <div class="fact-cell-label">
              👥 Nüfus
            </div>
            <p>
              ${esc(data.population)}
            </p>
          </div>

        </div>

        <div class="province-actions">

          <button
            class="province-action-btn discovered-btn${discovered ? " active" : ""}"
            data-province="${esc(nameNorm)}"
            type="button"
          >
            ${
              discovered
                ? "✓ Keşfedildi"
                : "● Keşfet"
            }
          </button>

          <button
            class="province-action-btn fav-btn${favorite ? " active" : ""}"
            data-province="${esc(nameNorm)}"
            type="button"
          >
            ${
              favorite
                ? "★ Favoride"
                : "☆ Favori Ekle"
            }
          </button>

        </div>

      </div>
    `;

    panel
      .querySelector(
        ".discovered-btn"
      )
      ?.addEventListener(
        "click",
        () => {
          markDiscovered(
            nameNorm
          );

          const button =
            panel.querySelector(
              ".discovered-btn"
            );

          if (button) {
            button.classList.add(
              "active"
            );

            button.textContent =
              "✓ Keşfedildi";
          }
        }
      );

    panel
      .querySelector(
        ".fav-btn"
      )
      ?.addEventListener(
        "click",
        async () => {
          await toggleFavorite(
            nameNorm,
            data.name
          );

          renderProvinceDetail(
            name
          );
        }
      );
  }

  /* =========================================================
     MAP MODE
  ========================================================= */

  function setMapMode(
    mode
  ) {
    if (!Object.hasOwn(MAP_LEGENDS, mode)) return;
    mapMode = mode;

    QA(".map-mode-btn")
      .forEach(button => {
        button.classList.toggle(
          "active",
          button.dataset.mode ===
            mode
        );
      });

    if (geoLayer) {
      geoLayer.setStyle(
        provinceStyle
      );
    }

    if (dashLayer) {
      dashLayer.setStyle(
        provinceStyle
      );
    }

    updateMapLegend();
  }

  function updateMapLegend() {
    const description = MAP_LEGENDS[mapMode] || MAP_LEGENDS.default;
    setText("map-legend", description);
    const modeNames = { default: "Standart", agriculture: "Tarım", climate: "İklim", terrain: "Arazi", mining: "Maden" };
    setText("map-legend-mode", modeNames[mapMode] || "Standart");
    const items = {
      default: [
        ["#43d59b", "Keşfedilen il", "İncelediğin iller"],
        ["#4f6f91", "Keşfedilmemiş il", "Henüz açmadığın iller"],
        ["#67bfff", "Seçili il", "Detay paneli açık"]
      ],
      agriculture: [
        ["#d9ad46", "Tahıl", "İç kesimler"], ["#4fc88f", "Çay / fındık", "Doğu Karadeniz"], ["#e57c5c", "Pamuk / narenciye", "Güney ve Ege kıyıları"]
      ],
      climate: [
        ["#ef8b62", "Akdeniz", "Yaz sıcak-kurak"], ["#4fc9a0", "Karadeniz", "Her mevsim yağışlı"], ["#8c73d6", "Karasal", "İç ve doğu kesimler"]
      ],
      terrain: [
        ["#8d68d8", "Dağlık", "Yükselti / dağ kuşakları"], ["#d7aa54", "Plato", "Yüksek düzlükler"], ["#4eb889", "Ova", "Tarım alanları"]
      ],
      mining: [
        ["#f0c15c", "Bor", "Batı Anadolu"], ["#8e9db2", "Kömür / linyit", "Zonguldak ve iç kesimler"], ["#d97561", "Metal madenleri", "Krom / demir / bakır"]
      ]
    };
    const container = $("map-legend-items");
    if (container) container.innerHTML = (items[mapMode] || items.default).map(item => `<div class="map-legend-item"><i style="background:${item[0]}"></i><span><b>${esc(item[1])}</b><small>${esc(item[2])}</small></span></div>`).join("");
  }

  updateMapLegend();

  function populateProvinceOptions() {
    const options = $("province-options");
    if (!options || options.children.length) return;
    options.innerHTML = PROVINCES
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "tr"))
      .map(province => `<option value="${esc(province.name)}"></option>`)
      .join("");
  }

  function resetMapView() {
    if (!fullMap || !geoLayer?.getBounds().isValid()) return;
    fullMap.fitBounds(geoLayer.getBounds(), { padding: [24, 24], animate: true });
    if ($("province-search")) $("province-search").value = "";
  }

  async function copyMapLink() {
    const url = new URL(location.href);
    url.hash = "map";
    if (selectedProvinceName) url.searchParams.set("il", selectedProvinceName);
    else url.searchParams.delete("il");
    try {
      await navigator.clipboard.writeText(url.toString());
      toast("Harita bağlantısı kopyalandı.", "success");
    } catch {
      toast("Bağlantı kopyalanamadı. Tarayıcı izinlerini kontrol et.", "error");
    }
  }

  /* =========================================================
     PROVINCE SEARCH
  ========================================================= */

  function searchProvince(
    query
  ) {
    if (
      !query
    ) {
      return;
    }

    if (!geoLayer) {
      toast("Harita hazırlanıyor; birkaç saniye sonra tekrar dene.", "info");
      return;
    }

    const normalized =
      norm(query);

    let found = null;

    geoLayer.eachLayer(
      layer => {
        if (
          !found &&
          norm(
            getProvinceName(
              layer.feature
            )
          ).includes(
            normalized
          )
        ) {
          found = layer;
        }
      }
    );

    if (!found) {
      toast(
        "İl bulunamadı.",
        "error"
      );
      return;
    }

    fullMap?.flyToBounds(
      found.getBounds(),
      {
        padding: [
          60,
          60
        ],
        maxZoom: 8,
        duration: 0.8
      }
    );

    setTimeout(
      () => {
        const name =
          getProvinceName(
            found.feature
          );

        selectedProvinceName = name;
        const url = new URL(location.href);
        url.searchParams.set("il", name);
        url.hash = "map";
        history.replaceState({ view: "map" }, "", url);
        const search = $("province-search");
        if (search) search.value = name;

        markDiscovered(
          norm(name)
        );

        renderProvinceDetail(
          name
        );
      },
      700
    );
  }

  /* =========================================================
     TOPICS
  ========================================================= */

  function renderTopics(
    filter = "all"
  ) {
    const grid =
      $("topics-grid");

    if (!grid) {
      return;
    }

    const list =
      TOPICS.filter(
        topic => {
          if (
            filter ===
            "all"
          ) {
            return true;
          }

          if (
            filter ===
            "high"
          ) {
            return (
              topic.level ===
              "Yüksek Getiri"
            );
          }

          if (
            filter ===
            "medium"
          ) {
            return (
              topic.level ===
              "Orta"
            );
          }

          return true;
        }
      );

    if (!list.length) {
      grid.innerHTML = `
        <div
          style="
            color:var(--text3);
            font-size:14px;
            grid-column:1/-1;
            padding:32px;
          "
        >
          Bu filtrede konu bulunamadı.
        </div>
      `;

      return;
    }

    grid.innerHTML =
      list.map(topic => {
        const pct =
          Number(
            STATE.topicPct?.[
              topic.id
            ]
          ) || 0;

        const levelClass =
          topic.level ===
          "Yüksek Getiri"
            ? "high"
            : "medium";

        return `
          <div
            class="topic-card"
            data-topic-id="${esc(topic.id)}"
            role="listitem"
            tabindex="0"
            aria-label="${esc(topic.title)} konusu"
          >

            <div class="topic-card-head">

              <span
                class="topic-icon"
                aria-hidden="true"
              >
                ${topic.icon}
              </span>

              <span
                class="level-badge ${levelClass}"
              >
                ${esc(topic.level)}
              </span>

            </div>

            <h3>
              ${esc(topic.title)}
            </h3>

            <p>
              ${esc(topic.desc)}
            </p>

            <div class="topic-progress-row">

              <div class="topic-bar-track">
                <div
                  class="topic-bar-fill"
                  style="width:${pct}%"
                ></div>
              </div>

              <span class="topic-pct">
                %${pct}
              </span>

            </div>

            <div class="topic-time">
              â± ~${esc(topic.minutes)} dk
            </div>

          </div>
        `;
      }).join("");

    grid
      .querySelectorAll(
        ".topic-card"
      )
      .forEach(card => {
        const open = () =>
          openTopicModal(
            card.dataset.topicId
          );

        card.addEventListener(
          "click",
          open
        );

        card.addEventListener(
          "keydown",
          event => {
            if (
              event.key ===
                "Enter" ||
              event.key ===
                " "
            ) {
              event.preventDefault();
              open();
            }
          }
        );
      });
  }

  function renderLibrary(filter = "all") {
    currentLibraryFilter = filter;
    const grid = $("library-grid");
    if (!grid) return;
    const list = TOPICS.filter(topic => filter === "all" || topic.level === filter);
    grid.innerHTML = list.map((topic, index) => {
      const pct = Math.max(0, Math.min(100, Number(STATE.topicPct?.[topic.id] || 0)));
      const bullets = Array.isArray(topic.bullets) ? topic.bullets.slice(0, 4) : [];
      return `
        <article class="library-card" data-topic-id="${esc(topic.id)}" tabindex="0" role="listitem" aria-label="${esc(topic.title)} çalışma notları">
          <div class="library-card-top">
            <div class="library-icon">${topic.icon}</div>
            <span class="library-level ${topic.level === "Yüksek Getiri" ? "high" : "mid"}">${esc(topic.level)}</span>
          </div>
          <div class="library-card-number">${String(index + 1).padStart(2, "0")}</div>
          <h3>${esc(topic.title)}</h3>
          <p class="library-desc">${esc(topic.desc)}</p>
          <div class="library-note-list">
            ${bullets.map((b, i) => `<div class="library-note"><span>${i + 1}</span><p>${esc(b)}</p></div>`).join("")}
          </div>
          <div class="library-card-foot">
            <div><span>İlerleme</span><strong>%${pct}</strong></div>
            <div class="library-progress"><i style="width:${pct}%"></i></div>
            <button class="library-open" type="button">Detayları aç <svg width="15" height="15"><use href="#ic-arrow-right"/></svg></button>
          </div>
        </article>`;
    }).join("");

    grid.querySelectorAll(".library-card").forEach(card => {
      const open = () => openTopicModal(card.dataset.topicId);
      card.onclick = event => {
        if (event.target.closest("button")) return;
        open();
      };
      card.querySelector(".library-open")?.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); open(); });
      card.onkeydown = event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
      };
    });
  }

  async function openTopicModal(
    topicId
  ) {
    const topic =
      TOPICS.find(
        item =>
          item.id ===
          topicId
      );

    if (!topic) {
      return;
    }

    const modal =
      $("topic-modal");

    if (!modal) {
      return;
    }

    setText(
      "topic-modal-title",
      topic.title
    );

    setText(
      "topic-modal-level",
      topic.level
    );

    setText(
      "topic-modal-desc",
      topic.desc
    );

    setText(
      "topic-modal-tip",
      topic.tip
    );

    setHTML(
      "topic-modal-bullets",
      (
        topic.bullets ||
        []
      )
        .map(
          bullet =>
            `<li>${esc(bullet)}</li>`
        )
        .join("")
    );

    const icon = $("topic-modal-icon");
    if (icon) icon.textContent = topic.icon || "ğŸ“š";

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const studiedButton = $("topic-modal-studied");
    const currentPct = Math.max(0, Math.min(100, Number(STATE.topicPct?.[topicId] || 0)));
    if (studiedButton) {
      studiedButton.textContent = currentPct >= 100 ? "✓ Konu tamamlandı" : "✓ Bu konuyu çalıştım";
      studiedButton.classList.toggle("is-complete", currentPct >= 100);
      studiedButton.onclick = () => {
        if (!STATE.topicPct) STATE.topicPct = {};
        const next = Math.min(100, Math.max(20, Number(STATE.topicPct[topicId] || 0) + 20));
        STATE.topicPct[topicId] = next;
        saveState();
        pushTopicProgress(topicId, next);
        if (!Array.isArray(STATE.dailyDone)) STATE.dailyDone = [];
        if (!STATE.dailyDone.includes("topic1")) STATE.dailyDone.push("topic1");
        saveState();
        studiedButton.textContent = next >= 100 ? "✓ Konu tamamlandı" : `✓ Çalışıldı · %${next}`;
        studiedButton.classList.add("is-complete");
        renderDashboard();
        renderLibrary(currentLibraryFilter || "all");
        toast(`${topic.title} ilerlemesi kaydedildi.`, "success");
      };
    }

    activeModal = modal;

    const quizButton =
      $("topic-modal-quiz");

    if (quizButton) {
      quizButton.onclick =
        () => {
          closeModal();

          navigate(
            "quiz"
          );

          setTimeout(
            () =>
              startQuiz(
                topicId
              ),
            200
          );
        };
    }
  }

  /* =========================================================
     QUIZ ENGINE
  ========================================================= */

  function startQuiz(
    topicFilter = null
  ) {
    let pool =
      topicFilter
        ? QUESTIONS.filter(
            question =>
              question.topic ===
              topicFilter
          )
        : QUESTIONS;

    if (
      pool.length < 3
    ) {
      pool = QUESTIONS;
    }

    if (!pool.length) {
      toast(
        "Henüz soru bulunamadı.",
        "error"
      );
      return;
    }

    const selected =
      [...pool]
        .sort(
          () =>
            Math.random() -
            0.5
        )
        .slice(
          0,
          Math.min(
            5,
            pool.length
          )
        );

    quizSession = {
      questions:
        selected,
      index: 0,
      answers: [],
      topicFilter
    };

    if (
      !STATE.dailyDone.includes(
        "quiz5"
      )
    ) {
      STATE.dailyDone.push(
        "quiz5"
      );

      saveState();
    }

    renderQuizCard();
  }

  function renderQuizCard() {
    const shell = $("quiz-shell");
    if (!shell || !quizSession) return;
    const {questions,index,answers} = quizSession;
    const question = questions[index];
    if (!question) { finishQuiz(); return; }
    const progress = Math.round((index / questions.length) * 100);
    const topic = TOPICS.find(item => item.id === question.topic)?.title || question.topic || "Coğrafya";
    const difficulty = String(question.difficulty || "").toLocaleUpperCase('tr-TR');
    const selected = quizSession.pendingSelected;
    shell.innerHTML = `
      <article class="quiz-card quiz-card-v8">
        <div class="quiz-card-topline">
          <div class="quiz-progress-copy"><span>SORU ${index+1} / ${questions.length}</span><strong>%${progress}</strong></div>
          <div class="quiz-progress-track"><i style="width:${Math.max(4,progress)}%"></i></div>
        </div>
        <div class="quiz-card-body">
          <div class="quiz-meta"><span class="quiz-counter">${index+1}. Soru</span><span class="quiz-topic-tag">${esc(topic)}</span><span class="quiz-difficulty">${esc(difficulty || 'KPSS')}</span></div>
          <div class="quiz-reading-label">ÖNCE OKU · SONRA CEVAPLA</div>
          <h3 class="quiz-question-v8">${esc(question.q)}</h3>
          <div class="quiz-options-v8">
            ${optionsSafe(question.options).map((option,i)=>{
              const correctIndex = Number(question.answer);
              const stateClass = quizSession.submitted ? (i === correctIndex ? 'is-correct' : (i === selected ? 'is-wrong' : '')) : '';
              const stateIcon = quizSession.submitted ? (i === correctIndex ? '✓' : (i === selected ? 'Ã—' : '')) : '';
              return `<button class="quiz-option quiz-option-v8 ${selected===i?'selected':''} ${stateClass}" data-idx="${i}" type="button" ${quizSession.submitted?'disabled':''}><span class="option-label">${String.fromCharCode(65+i)}</span><span class="option-text">${esc(option)}</span><span class="option-state" aria-hidden="true">${stateIcon}</span></button>`;
            }).join('')}
          </div>
          <div class="quiz-action-row">
            ${quizSession.submitted ? `<div class="quiz-result-inline ${quizSession.currentRight?'is-correct':'is-wrong'}"><strong>${quizSession.currentRight?'Doğru cevap!':'Cevap kontrol edildi.'}</strong><span>${esc(question.explain || 'Açıklama bulunmuyor.')}</span>${question.source ? `<small class="quiz-source">Kaynak: ${esc(question.source)}</small>` : ''}</div><button class="primary-btn quiz-next-btn" id="quiz-next-btn" type="button">${index+1 < questions.length ? 'Sonraki Soru' : 'Testi Bitir'} →</button>` : `<div class="quiz-selection-note">${selected === undefined ? 'Bir şık seç. Cevabı hemen göstermiyoruz.' : 'Seçimin hazır. Şimdi cevabı kontrol edebilirsin.'}</div><button class="primary-btn quiz-check-btn" id="quiz-check-btn" type="button" ${selected === undefined ? 'disabled' : ''}>Cevabı Kontrol Et ✓</button>`}
          </div>
        </div>
      </article>`;

    shell.querySelectorAll('.quiz-option').forEach(button=>button.addEventListener('click',()=>{
      if (quizSession.submitted) return;
      quizSession.pendingSelected = Number(button.dataset.idx);
      renderQuizCard();
    }));
    shell.querySelector('#quiz-check-btn')?.addEventListener('click', submitQuizAnswer);
    shell.querySelector('#quiz-next-btn')?.addEventListener('click', ()=>{
      quizSession.index++;
      quizSession.pendingSelected = undefined;
      quizSession.submitted = false;
      quizSession.currentRight = false;
      if (quizSession.index < quizSession.questions.length) renderQuizCard(); else finishQuiz();
    });
  }

  function optionsSafe(value){ return Array.isArray(value) ? value : []; }

  function submitQuizAnswer(){
    if (!quizSession || quizSession.submitted || quizSession.pendingSelected === undefined) return;
    const question = quizSession.questions[quizSession.index];
    if (!question) return;
    const selected = Number(quizSession.pendingSelected);
    const correct = Number(question.answer);
    const isRight = selected === correct;
    quizSession.answers.push({selected,correct,isRight});
    quizSession.submitted = true;
    quizSession.currentRight = isRight;
    renderQuizCard();
  }

  // Backward-compatible name for any existing callers.
  function answerQuiz(selected){
    if (!quizSession || quizSession.submitted) return;
    quizSession.pendingSelected = Number(selected);
    renderQuizCard();
  }

  /* =========================================================
     QUIZ FINISH
  ========================================================= */

  function finishQuiz() {
    if (!quizSession) {
      return;
    }

    const {
      questions,
      answers,
      topicFilter
    } = quizSession;

    const total =
      questions.length;

    const correct =
      answers.filter(
        answer =>
          answer.isRight
      ).length;

    const pct =
      total > 0
        ? Math.round(
            (correct / total) *
              100
          )
        : 0;

    const result = {
      date:
        new Date().toISOString(),
      total,
      correct,
      wrong:
        total - correct,
      topicId:
        topicFilter ||
        "mixed",
      pct
    };

    if (!STATE.results) {
      STATE.results = [];
    }

    STATE.results.unshift(
      result
    );

    if (
      STATE.results.length >
      200
    ) {
      STATE.results =
        STATE.results.slice(
          0,
          200
        );
    }

    if (topicFilter) {
      if (!STATE.topicPct) {
        STATE.topicPct = {};
      }

      const current =
        Number(
          STATE.topicPct[
            topicFilter
          ]
        ) || 0;

      STATE.topicPct[
        topicFilter
      ] = Math.min(
        100,
        Math.max(
          current,
          pct
        )
      );

      pushTopicProgress(
        topicFilter,
        STATE.topicPct[
          topicFilter
        ]
      );
    }

    saveState();

    pushResult(result);

    quizSession = null;

    const emoji =
      pct >= 80
        ? "ğŸ‰"
        : pct >= 60
          ? "ğŸ‘"
          : pct >= 40
            ? "ğŸ“š"
            : "ğŸ’ª";

    const message =
      pct >= 80
        ? "Harika! KPSS'ye hazırsın."
        : pct >= 60
          ? "İyi gidiyorsun!"
          : pct >= 40
            ? "Biraz daha çalışalım."
            : "Tekrar çalışmak iyi olur.";

    const degree =
      Math.round(
        (pct / 100) *
          360
      );

    const shell =
      $("quiz-shell");

    if (!shell) {
      return;
    }

    shell.innerHTML = `
      <div class="quiz-card">

        <div class="quiz-result">

          <div
            class="quiz-result-score"
            style="
              background:
                conic-gradient(
                  var(--accent)
                  ${degree}deg,
                  var(--surface3)
                  ${degree}deg
                )
            "
          >
            <span>
              ${pct}%
            </span>
          </div>

          <h3>
            ${emoji}
            ${
              pct >= 60
                ? "Tebrikler!"
                : "Devam Et!"
            }
          </h3>

          <p>
            <strong>
              ${correct}/${total}
            </strong>
            doğru.
            ${esc(message)}
          </p>

          <div class="quiz-result-actions">

            <button
              class="primary-btn"
              id="quiz-retry-btn"
              type="button"
            >
              Tekrar Dene
              <span>â†º</span>
            </button>

            <button
              class="ghost-btn"
              id="quiz-stats-btn"
              type="button"
            >
              İstatistikler
              <span>→</span>
            </button>

          </div>

          <div
            style="
              margin-top:16px;
            "
          >
            <button
              class="ghost-btn"
              id="quiz-back-btn"
              type="button"
              style="
                width:100%;
                justify-content:center;
              "
            >
              â† Test Ekranına Dön
            </button>
          </div>

        </div>

      </div>
    `;

    $("quiz-retry-btn")
      ?.addEventListener(
        "click",
        () =>
          startQuiz(
            topicFilter
          )
      );

    $("quiz-stats-btn")
      ?.addEventListener(
        "click",
        () =>
          navigate(
            "stats"
          )
      );

    $("quiz-back-btn")
      ?.addEventListener(
        "click",
        resetQuizShell
      );

    toast(
      `Test bitti: ${correct}/${total} doğru (%${pct})`,
      pct >= 60
        ? "success"
        : "info"
    );
  }

  function resetQuizShell() {
    const shell =
      $("quiz-shell");

    if (!shell) {
      return;
    }

    shell.innerHTML = `
      <div class="quiz-start" id="quiz-start-screen">

        <div
          class="quiz-start-visual"
          aria-hidden="true"
        >
          â“
          <i></i>
          <i></i>
          <i></i>
        </div>

        <div class="quiz-start-copy">

          <div class="eyebrow">
            5 SORU • KARIŞIK COĞRAFYA
          </div>

          <h3>
            Tekrar dene?
          </h3>

          <p>
            Her soruda tek doğru cevap var.
          </p>

          <div class="quiz-rules">
            <span>
              ⏱ ~3 dk
            </span>

            <span>
              ✓ 5 soru
            </span>

            <span>
              ★ KPSS odaklı
            </span>
          </div>

          <button
            class="primary-btn"
            id="start-quiz-btn"
            type="button"
          >
            Teste Başla
            <span>→</span>
          </button>

        </div>

      </div>
    `;

    $("start-quiz-btn")
      ?.addEventListener(
        "click",
        () =>
          startQuiz()
      );
  }

  /* =========================================================
     STATS
  ========================================================= */

  function renderStats() {
    const total =
      STATE.results.reduce(
        (sum, result) =>
          sum +
          (Number(result.total) || 0),
        0
      );

    const correct =
      STATE.results.reduce(
        (sum, result) =>
          sum +
          (Number(result.correct) || 0),
        0
      );

    const discovered =
      STATE.discovered.length;

    const discoveredPct =
      Math.round(
        (discovered / 81) *
          100
      );

    const accuracy =
      total > 0
        ? `%${Math.round(
            (correct / total) *
              100
          )}`
        : "—";

    setText(
      "stats-total",
      total
    );

    setText(
      "stats-correct",
      correct
    );

    setText(
      "stats-wrong",
      total - correct
    );

    setText(
      "stats-accuracy",
      accuracy
    );

    setText(
      "stats-province-count",
      `${discovered} / 81`
    );

    const ring =
      $("province-ring");

    if (ring) {
      const degree =
        Math.round(
          (discoveredPct / 100) *
            360
        );

      ring.style.background =
        `conic-gradient(
          var(--accent)
          ${degree}deg,
          var(--surface3)
          ${degree}deg
        )`;

      const span =
        ring.querySelector(
          "span"
        );

      if (span) {
        span.textContent =
          `%${discoveredPct}`;
      }
    }

    renderStatsTopics();

    renderRegionGrid();

    renderRecentResults();
  }

  function renderStatsTopics() {
    const element =
      $("stats-topics");

    if (!element) {
      return;
    }

    if (!TOPICS.length) {
      element.innerHTML = `
        <p
          style="
            color:var(--text3);
            padding:16px 20px;
          "
        >
          Henüz konu çalışması yok.
        </p>
      `;

      return;
    }

    element.innerHTML =
      TOPICS.map(topic => {
        const pct =
          Number(
            STATE.topicPct?.[
              topic.id
            ]
          ) || 0;

        return `
          <div
            class="stats-topic-row"
            role="listitem"
          >

            <div
              class="stats-topic-name"
            >
              <span>
                ${topic.icon}
              </span>

              ${esc(
                topic.title
              )}
            </div>

            <div
              class="stats-topic-bar"
            >
              <div
                class="stats-topic-fill"
                style="
                  width:${pct}%
                "
              ></div>
            </div>

            <div
              class="stats-topic-pct"
            >
              %${pct}
            </div>

          </div>
        `;
      }).join("");
  }

  function renderRegionGrid() {
    const element =
      $("region-mini-grid");

    if (!element) {
      return;
    }

    const regions = {};

    PROVINCES.forEach(
      province => {
        if (
          !regions[
            province.region
          ]
        ) {
          regions[
            province.region
          ] = {
            total: 0,
            discovered: 0
          };
        }

        regions[
          province.region
        ].total++;

        if (
          STATE.discovered.includes(
            norm(
              province.name
            )
          )
        ) {
          regions[
            province.region
          ].discovered++;
        }
      }
    );

    element.innerHTML =
      Object.entries(
        regions
      )
        .sort(
          (
            a,
            b
          ) =>
            b[1].discovered -
            a[1].discovered
        )
        .map(
          ([
            region,
            data
          ]) => `
            <div
              class="region-mini-cell"
              role="listitem"
            >
              <b>
                ${esc(region)}
              </b>

              <span>
                ${data.discovered}/${data.total} il
              </span>
            </div>
          `
        )
        .join("");
  }

  function renderRecentResults() {
    const element =
      $("recent-results");

    if (!element) {
      return;
    }

    if (
      !STATE.results?.length
    ) {
      element.innerHTML = `
        <p
          style="
            color:var(--text3);
            padding:16px 20px;
          "
        >
          Henüz test çözülmedi.
        </p>
      `;

      return;
    }

    element.innerHTML =
      STATE.results
        .slice(0, 15)
        .map(result => {
          const pct =
            result.pct ??
            (
              result.total > 0
                ? Math.round(
                    (result.correct /
                      result.total) *
                      100
                  )
                : 0
            );

          const className =
            pct >= 70
              ? "good"
              : pct >= 40
                ? "medium"
                : "bad";

          const topic =
            TOPICS.find(
              item =>
                item.id ===
                result.topicId
            )?.title ||
            (
              result.topicId ===
              "mixed"
                ? "Karışık"
                : result.topicId ||
                  "Karışık"
            );

          return `
            <div
              class="recent-item"
              role="listitem"
            >

              <div
                class="recent-score ${className}"
              >
                %${pct}
              </div>

              <div
                class="recent-body"
              >

                <div
                  class="recent-topic"
                >
                  ${esc(topic)}
                </div>

                <div
                  class="recent-date"
                >
                  ${formatDate(
                    result.date
                  )}
                </div>

              </div>

              <div
                class="recent-correct"
              >
                ${Number(
                  result.correct
                ) || 0}/${Number(
                  result.total
                ) || 0}
              </div>

            </div>
          `;
        })
        .join("");
  }

  /* =========================================================
     FAVORITES
  ========================================================= */

  async function toggleFavorite(
    key,
    displayName
  ) {
    if (!STATE.favorites) {
      STATE.favorites = [];
    }

    const index =
      STATE.favorites.indexOf(
        key
      );

    const wasFavorite =
      index >= 0;

    /* Optimistic local update */

    if (wasFavorite) {
      STATE.favorites.splice(
        index,
        1
      );
    } else {
      STATE.favorites.push(
        key
      );
    }

    saveState();

    if (
      $("view-favorites")
        ?.classList.contains(
          "active"
        )
    ) {
      renderFavorites();
    }

    /* Remote */

    if (isRemoteSession()) {
      try {
        await pushFavorite(
          key,
          !wasFavorite
        );
      } catch (error) {
        /* Rollback */

        if (wasFavorite) {
          if (
            !STATE.favorites.includes(
              key
            )
          ) {
            STATE.favorites.push(
              key
            );
          }
        } else {
          const rollbackIndex =
            STATE.favorites.indexOf(
              key
            );

          if (
            rollbackIndex >=
            0
          ) {
            STATE.favorites.splice(
              rollbackIndex,
              1
            );
          }
        }

        saveState();

        if (
          $("view-favorites")
            ?.classList.contains(
              "active"
            )
        ) {
          renderFavorites();
        }

        console.warn(
          "Favori senkronizasyonu başarısız:",
          error
        );

        toast(
          "Favori sunucuya kaydedilemedi.",
          "error"
        );

        return;
      }
    }

    toast(
      `${displayName || key} ${
        wasFavorite
          ? "favorilerden çıkarıldı."
          : "favorilere eklendi. ★"
      }`,
      wasFavorite
        ? "info"
        : "success"
    );
  }

  function renderFavorites() {
    const grid =
      $("favorites-grid");

    if (!grid) {
      return;
    }

    if (
      !STATE.favorites?.length
    ) {
      grid.innerHTML = `
        <div class="empty-fav">

          <div
            class="empty-fav-icon"
          >
            ★
          </div>

          <h3>
            Henüz favori eklenmedi
          </h3>

          <p>
            Haritada bir ile tıkla
            ve "Favori Ekle"
            butonunu kullan.
          </p>

        </div>
      `;

      return;
    }

    const cards =
      STATE.favorites
        .map(key => {
          if (
            String(key).startsWith(
              "topic:"
            )
          ) {
            const topicId =
              String(
                key
              ).slice(6);

            const topic =
              TOPICS.find(
                item =>
                  item.id ===
                  topicId
              );

            if (!topic) {
              return "";
            }

            return `
              <div
                class="fav-card"
                data-fav-type="topic"
                data-fav-id="${esc(topicId)}"
                role="listitem"
                tabindex="0"
              >

                <div
                  class="fav-icon"
                >
                  ${topic.icon}
                </div>

                <div
                  class="fav-body"
                >
                  <h4>
                    ${esc(
                      topic.title
                    )}
                  </h4>

                  <p>
                    Konu •
                    ${esc(
                      topic.level
                    )}
                  </p>
                </div>

                <button
                  class="fav-remove"
                  data-fav-key="${esc(key)}"
                  type="button"
                  aria-label="Favoriden çıkar"
                >
                  ✕
                </button>

              </div>
            `;
          }

          const data =
            PMAP.get(
              norm(key)
            ) ||
            PROVINCES.find(
              province =>
                norm(
                  province.name
                ) ===
                norm(key)
            );

          if (!data) {
            return "";
          }

          return `
            <div
              class="fav-card"
              data-fav-type="province"
              data-fav-id="${esc(
                norm(data.name)
              )}"
              role="listitem"
              tabindex="0"
            >

              <div
                class="fav-icon"
              >
                🗺️
              </div>

              <div
                class="fav-body"
              >
                <h4>
                  ${esc(
                    data.name ||
                    key
                  )}
                </h4>

                <p>
                  İl •
                  ${esc(
                    data.region ||
                    ""
                  )}
                </p>
              </div>

              <button
                class="fav-remove"
                data-fav-key="${esc(key)}"
                type="button"
                aria-label="Favoriden çıkar"
              >
                ✕
              </button>

            </div>
          `;
        })
        .join("");

    grid.innerHTML =
      cards ||
      `
        <div class="empty-fav">
          <div class="empty-fav-icon">
            ★
          </div>

          <h3>
            Favori bulunamadı
          </h3>
        </div>
      `;

    grid
      .querySelectorAll(
        ".fav-card"
      )
      .forEach(card => {
        card.addEventListener(
          "click",
          event => {
            if (
              event.target.closest(
                ".fav-remove"
              )
            ) {
              return;
            }

            const type =
              card.dataset.favType;

            const id =
              card.dataset.favId;

            if (
              type ===
              "province"
            ) {
              navigate(
                "map"
              );

              setTimeout(
                () =>
                  searchProvince(
                    id
                  ),
                300
              );
            }

            if (
              type ===
              "topic"
            ) {
              openTopicModal(
                id
              );
            }
          }
        );

        card.addEventListener(
          "keydown",
          event => {
            if (
              event.key ===
                "Enter" ||
              event.key ===
                " "
            ) {
              event.preventDefault();

              card.click();
            }
          }
        );
      });

    grid
      .querySelectorAll(
        ".fav-remove"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          event => {
            event.stopPropagation();

            const key =
              button.dataset
                .favKey;

            let displayName =
              key;

            if (
              String(key).startsWith(
                "topic:"
              )
            ) {
              const topic =
                TOPICS.find(
                  item =>
                    item.id ===
                    String(
                      key
                    ).slice(6)
                );

              displayName =
                topic?.title ||
                key;

            } else {
              const province =
                PMAP.get(
                  norm(key)
                ) ||
                PROVINCES.find(
                  item =>
                    norm(
                      item.name
                    ) ===
                    norm(key)
                );

              displayName =
                province?.name ||
                key;
            }

            toggleFavorite(
              key,
              displayName
            );
          }
        );
      });
  }

  /* =========================================================
     SETTINGS — PROFILE
  ========================================================= */

  async function saveProfile() {
    const input =
      $("settings-name-input");

    if (!input) {
      return;
    }

    const newName =
      input.value.trim();

    if (
      !newName ||
      newName.length < 2
    ) {
      toast(
        "Geçerli bir ad gir.",
        "error"
      );
      return;
    }

    STATE.profile.displayName =
      newName;

    saveState();

    renderUserUI();

    if (isRemoteSession()) {
      const { error } =
        await sb
          .from("profiles")
          .upsert(
            {
              id:
                currentUser.id,
              display_name:
                newName,
              updated_at:
                new Date().toISOString()
            },
            {
              onConflict: "id"
            }
          );

      if (error) {
        console.warn(
          "Profil Supabase'e kaydedilemedi:",
          error
        );

        toast(
          "Profil güncellendi ancak sunucuya kaydedilemedi.",
          "error"
        );

        return;
      }

      try {
        await sb.auth.updateUser({
          data: {
            display_name:
              newName
          }
        });
      } catch (error) {
        console.warn(
          "Auth metadata güncellenemedi:",
          error
        );
      }
    }

    toast(
      "Profil güncellendi.",
      "success"
    );
  }

  /* =========================================================
     RESET ALL DATA
  ========================================================= */

  async function resetAllData() {
    const confirmed =
      confirm(
        "Tüm keşif, konu ilerlemesi, test sonuçları ve favori verilerin silinecek. Hesabın silinmeyecek. Emin misin?"
      );

    if (!confirmed) {
      return;
    }

    const name =
      currentUser?.user_metadata
        ?.display_name ||
      currentUser?.email?.split(
        "@"
      )[0] ||
      STATE.profile.displayName ||
      "Öğrenci";

    const email =
      currentUser?.email ||
      STATE.profile.email ||
      "";

    let remoteError =
      false;

    if (isRemoteSession()) {
      const uid =
        currentUser.id;

      const responses =
        await Promise.all([
          sb
            .from(
              "province_progress"
            )
            .delete()
            .eq(
              "user_id",
              uid
            ),

          sb
            .from(
              "topic_progress"
            )
            .delete()
            .eq(
              "user_id",
              uid
            ),

          sb
            .from(
              "quiz_results"
            )
            .delete()
            .eq(
              "user_id",
              uid
            ),

          sb
            .from(
              "favorites"
            )
            .delete()
            .eq(
              "user_id",
              uid
            )
        ]);

      remoteError =
        responses.some(
          response =>
            response.error
        );

      if (remoteError) {
        console.warn(
          "Bazı Supabase verileri silinemedi:",
          responses
        );
      }
    }

    STATE = {
      ...cloneDefaultState(),

      profile: {
        displayName:
          name,
        email
      }
    };

    saveState();

    if (geoLayer) {
      geoLayer.setStyle(
        provinceStyle
      );
    }

    if (dashLayer) {
      dashLayer.setStyle(
        provinceStyle
      );
    }

    renderDashboard();

    renderTopics();

    renderStats();

    renderFavorites();

    renderUserUI();

    if (remoteError) {
      toast(
        "Yerel veriler sıfırlandı ancak bazı sunucu verileri silinemedi.",
        "error"
      );
    } else {
      toast(
        "Tüm verilerin sıfırlandı.",
        "success"
      );
    }
  }

  /* =========================================================
     MODAL
  ========================================================= */

  function closeModal() {
    if (activeModal) {
      activeModal.classList.add("hidden");
      activeModal.setAttribute("aria-hidden", "true");
      activeModal = null;
    }
    document.body.classList.remove("modal-open");
  }

  /* =========================================================
     GLOBAL SEARCH
  ========================================================= */

  function handleGlobalSearch(
    query
  ) {
    const value =
      String(
        query || ""
      ).trim();

    if (!value) {
      return;
    }

    const normalized =
      norm(value);

    const province =
      PMAP.get(
        normalized
      ) ||
      PROVINCES.find(
        item =>
          norm(
            item.name
          ).includes(
            normalized
          )
      );

    if (province) {
      navigate("map");

      setTimeout(
        () =>
          searchProvince(
            province.name
          ),
        300
      );

      return;
    }

    const topic =
      TOPICS.find(
        item =>
          norm(
            item.title
          ).includes(
            normalized
          ) ||
          item.id ===
            normalized
      );

    if (topic) {
      navigate(
        "topics"
      );

      setTimeout(
        () =>
          openTopicModal(
            topic.id
          ),
        200
      );

      return;
    }

    toast(
      "Sonuç bulunamadı.",
      "info"
    );
  }

  /* =========================================================
     SIDEBAR
  ========================================================= */

  function openSidebar() {
    $("sidebar")?.classList.add("open", "yb-mobile-open");
    $("sidebar-overlay")?.classList.add("show");
    $("mobile-menu-btn")?.setAttribute("aria-expanded", "true");
    document.body.classList.add("yb-drawer-open");
  }

  function closeSidebar() {
    $("sidebar")?.classList.remove("open", "yb-mobile-open");
    $("sidebar-overlay")?.classList.remove("show");
    $("mobile-menu-btn")?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("yb-drawer-open");
    $(".yb-sidebar-backdrop")?.classList.remove("show");
  }

  /* =========================================================
     PROFILE DROPDOWN
  ========================================================= */

  function toggleProfileDropdown() {
    const dropdown =
      $("profile-dropdown");

    if (!dropdown) {
      return;
    }

    const isOpen =
      !dropdown.classList.contains(
        "hidden"
      );

    dropdown.classList.toggle(
      "hidden",
      isOpen
    );

    $("profile-btn")
      ?.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );
  }

  function closeProfileDropdown() {
    $("profile-dropdown")
      ?.classList.add(
        "hidden"
      );

    $("profile-btn")
      ?.setAttribute(
        "aria-expanded",
        "false"
      );
  }

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  function showFormError(
    id,
    message
  ) {
    const element =
      $(id);

    if (element) {
      element.textContent =
        message;

      element.style.display =
        "block";
    }
  }

  function clearFormErrors() {
    [
      "login-error",
      "register-error"
    ].forEach(id => {
      const element =
        $(id);

      if (element) {
        element.textContent =
          "";

        element.style.display =
          "none";
      }
    });
  }

  function setButtonLoading(
    id,
    loading
  ) {
    const button =
      $(id);

    if (!button) {
      return;
    }

    button.disabled =
      loading;

    button.classList.toggle(
      "loading",
      loading
    );
  }

  /* =========================================================
     EVENT BINDING
  ========================================================= */

  function bindEvents() {

    /* Auth tabs */

    QA(
      ".auth-tab, .inline-link"
    ).forEach(element => {
      element.addEventListener(
        "click",
        () => {
          if (
            element.dataset
              .auth
          ) {
            switchAuthTab(
              element.dataset
                .auth
            );
          }
        }
      );
    });

    /* Login */

    $("login-form")
      ?.addEventListener(
        "submit",
        async event => {
          event.preventDefault();

          clearFormErrors();

          const email =
            $("login-email")
              ?.value.trim();

          const password =
            $("login-password")
              ?.value;

          if (
            !email ||
            !password
          ) {
            showFormError(
              "login-error",
              "Tüm alanları doldur."
            );

            return;
          }

          setButtonLoading(
            "login-submit-btn",
            true
          );

          try {
            await doLogin(
              email,
              password
            );
          } catch (error) {
            showFormError(
              "login-error",
              error.message ||
                "Giriş başarısız."
            );
          } finally {
            setButtonLoading(
              "login-submit-btn",
              false
            );
          }
        }
      );

    /* Register */

    $("register-form")
      ?.addEventListener(
        "submit",
        async event => {
          event.preventDefault();

          clearFormErrors();

          const name =
            $("reg-name")
              ?.value.trim();

          const email =
            $("reg-email")
              ?.value.trim();

          const password =
            $("reg-password")
              ?.value;

          const password2 =
            $("reg-password2")
              ?.value;

          const terms =
            $("reg-terms")
              ?.checked;

          if (
            !name ||
            !email ||
            !password
          ) {
            showFormError(
              "register-error",
              "Tüm alanları doldur."
            );

            return;
          }

          if (
            password.length <
            6
          ) {
            showFormError(
              "register-error",
              "Şifre en az 6 karakter."
            );

            return;
          }

          if (
            password !==
            password2
          ) {
            showFormError(
              "register-error",
              "Şifreler eşleşmiyor."
            );

            return;
          }

          if (!terms) {
            showFormError(
              "register-error",
              "Kullanım koşullarını kabul et."
            );

            return;
          }

          setButtonLoading(
            "register-submit-btn",
            true
          );

          try {
            await doRegister(
              name,
              email,
              password
            );
          } catch (error) {
            showFormError(
              "register-error",
              error.message ||
                "Kayıt başarısız."
            );
          } finally {
            setButtonLoading(
              "register-submit-btn",
              false
            );
          }
        }
      );

    /* Forgot password */

    $("forgot-btn")
      ?.addEventListener(
        "click",
        doForgotPassword
      );

    /* Google */

    $("google-login-btn")
      ?.addEventListener(
        "click",
        doGoogleLogin
      );

    /* Guest mode keeps exploration usable when the user does not want to sign in. */
    $("guest-btn")
      ?.addEventListener(
        "click",
        startGuestSession
      );

    /* Password visibility */

    QA(
      ".password-toggle"
    ).forEach(button => {
      button.addEventListener(
        "click",
        () => {
          const input =
            $(
              button.dataset
                .target
            );

          if (!input) {
            return;
          }

          const show =
            input.type ===
            "password";

          input.type =
            show
              ? "text"
              : "password";

          button.textContent =
            show
              ? "Gizle"
              : "Göster";
        }
      );
    });

    /* Sidebar navigation */

    QA(
      ".nav-item[data-view]"
    ).forEach(button => {
      button.addEventListener(
        "click",
        () =>
          navigate(
            button.dataset
              .view
          )
      );
    });

    /* Generic data-view */

    document.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "[data-view]"
          );

        if (!button) {
          return;
        }

        if (
          button.closest(
            ".nav-item"
          )
        ) {
          return;
        }

        if (
          $("app-screen")
            ?.classList.contains(
              "hidden"
            )
        ) {
          return;
        }

        navigate(
          button.dataset
            .view
        );
      }
    );

    /* Quick quiz */

    $("quick-quiz-btn")
      ?.addEventListener(
        "click",
        () => {
          navigate(
            "quiz"
          );

          setTimeout(
            () =>
              startQuiz(),
            150
          );
        }
      );

    /* Start quiz */

    $("start-quiz-btn")
      ?.addEventListener(
        "click",
        () =>
          startQuiz()
      );

    /* Logout */

    const logout =
      () => {
        if (
          confirm(
            "Çıkış yapmak istediğinden emin misin?"
          )
        ) {
          doLogout();
        }
      };

    $("logout-btn")
      ?.addEventListener(
        "click",
        logout
      );

    $("sidebar-logout-btn")
      ?.addEventListener(
        "click",
        logout
      );

    $("dropdown-logout")
      ?.addEventListener(
        "click",
        logout
      );

    /* Reset */

    $("reset-data-btn")
      ?.addEventListener(
        "click",
        resetAllData
      );

    /* Profile */

    $("save-profile-btn")
      ?.addEventListener(
        "click",
        saveProfile
      );

    /* Profile dropdown */

    $("profile-btn")
      ?.addEventListener(
        "click",
        event => {
          event.stopPropagation();

          toggleProfileDropdown();
        }
      );

    $("sidebar-user")
      ?.addEventListener(
        "click",
        () =>
          navigate(
            "settings"
          )
      );

    QA(
      ".dropdown-item[data-view]"
    ).forEach(button => {
      button.addEventListener(
        "click",
        () => {
          closeProfileDropdown();

          navigate(
            button.dataset
              .view
          );
        }
      );
    });

    document.addEventListener(
      "click",
      event => {
        if (
          !event.target.closest(
            "#profile-dropdown"
          ) &&
          !event.target.closest(
            "#profile-btn"
          )
        ) {
          closeProfileDropdown();
        }
      }
    );

    /* Mobile menu */

    $("mobile-menu-btn")
      ?.addEventListener(
        "click",
        () => {
          if (
            $("sidebar")
              ?.classList.contains(
                "open"
              )
          ) {
            closeSidebar();
          } else {
            openSidebar();
          }
        }
      );

    $("sidebar-overlay")
      ?.addEventListener(
        "click",
        closeSidebar
      );

    /* Province search */

    $("province-search")
      ?.addEventListener(
        "keydown",
        event => {
          if (
            event.key ===
            "Enter"
          ) {
            searchProvince(
              event.target.value
            );
          }
        }
      );

    $("map-reset-btn")
      ?.addEventListener("click", resetMapView);

    $("map-share-btn")
      ?.addEventListener("click", copyMapLink);

    /* Global search */

    $("global-search")
      ?.addEventListener(
        "keydown",
        event => {
          if (
            event.key ===
            "Enter"
          ) {
            handleGlobalSearch(
              event.target.value
            );

            event.target.value =
              "";
          }
        }
      );

    /* Keyboard shortcuts */

    document.addEventListener(
      "keydown",
      event => {
        if (
          (
            event.ctrlKey ||
            event.metaKey
          ) &&
          event.key.toLowerCase() ===
            "k"
        ) {
          event.preventDefault();

          if (
            !$(
              "app-screen"
            )?.classList.contains(
              "hidden"
            )
          ) {
            $("global-search")
              ?.focus();
          }
        }

        if (
          event.key ===
          "Escape"
        ) {
          closeModal();
          closeProfileDropdown();
          closeSidebar();
        }
      }
    );

    /* Map modes */

    QA(
      ".map-mode-btn"
    ).forEach(button => {
      button.addEventListener(
        "click",
        () =>
          setMapMode(
            button.dataset
              .mode
          )
      );
    });

    /* Library filters */

    QA(".library-filter[data-library-filter]").forEach(button => {
      button.addEventListener("click", () => {
        QA(".library-filter").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        renderLibrary(button.dataset.libraryFilter || "all");
      });
    });

    /* Topic filters */

    QA(
      ".filter-btn[data-filter]"
    ).forEach(button => {
      button.addEventListener(
        "click",
        () => {
          QA(
            ".filter-btn"
          ).forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );

          button.classList.add(
            "active"
          );

          renderTopics(
            button.dataset
              .filter
          );
        }
      );
    });

    /* Topic modal */

    $("topic-modal-close")
      ?.addEventListener(
        "click",
        closeModal
      );

    $("topic-modal")
      ?.addEventListener(
        "click",
        event => {
          if (
            event.target ===
            $("topic-modal")
          ) {
            closeModal();
          }
        }
      );

    /* Notification */

    $("notif-btn")
      ?.addEventListener(
        "click",
        event => {
          event.stopPropagation();

          toast(
            "Bugünkü hedef: 3 il keşfet + 1 test çöz. Hadi! ğŸ¯",
            "info"
          );

          $("notif-btn")
            ?.querySelector(
              ".notif-dot"
            )
            ?.remove();
        }
      );
  }

  window.addEventListener('popstate', () => {
    if (!$('app-screen') || $('app-screen').classList.contains('hidden')) return;
    navigate(getInitialView(), {history:false});
  });

  /* =========================================================
     SUPABASE AUTH LISTENER
  ========================================================= */

  function initSupabaseListener() {
    if (!sb) {
      return;
    }

    sb.auth.onAuthStateChange(
      (event, session) => {
        /*
         * Supabase callback icinde dogrudan baska async auth
         * islemleri calistirmiyoruz. setTimeout deadlock/race
         * ihtimalini azaltir.
         */
        setTimeout(async () => {
          try {
            if (session?.user) {
              await applyRemoteSession(
                session,
                {
                  sync: event === "SIGNED_IN"
                }
              );
              return;
            }

            if (event === "SIGNED_OUT") {
              currentUser = null;
              STATE = cloneDefaultState();
              saveState();
              destroyMaps();
              appMapsBooted = false;
              showAuthScreen("login");
            }
          } catch (error) {
            console.warn(
              "Auth session handler hatası:",
              error
            );
          }
        }, 0);
      }
    );
  }
  /* =========================================================
     BOOT
  ========================================================= */

  async function boot() {
    installAppDiagnostics();
    installExamCountdown();
    bindEvents();

    initSupabaseListener();

    /*
     * Supabase varsa kimlik icin LocalStorage STATE yerine
     * Supabase session kullanilir.
     */
    if (sb) {
      try {
        const {
          data,
          error
        } = await sb.auth.getSession();

        if (error) {
          console.warn(
            "Supabase session okunamadı:",
            error
          );
        }

        const session =
          data?.session || null;

        if (session?.user) {
          await applyRemoteSession(
            session,
            {
              sync: true
            }
          );
          return;
        }

      } catch (error) {
        console.warn(
          "Session alınamadı:",
          error
        );
      }

      showAuthScreen(
        getRequestedAuthMode()
      );

      return;
    }

    /*
     * Sadece Supabase yoksa demo auto-resume.
     */
    if (
      STATE.profile.email
    ) {
      const users =
        getLocalUsers();

      const found =
        users.find(
          user =>
            normalizeEmail(user.email) ===
            normalizeEmail(
              STATE.profile.email
            )
        );

      if (found) {
        currentUser = {
          id: found.id,
          email: found.email,
          demo: true
        };

        STATE.profile.displayName =
          found.name ||
          "Öğrenci";

        STATE.profile.email =
          found.email;

        showAppScreen();

        return;
      }
    }

    showAuthScreen(
      getRequestedAuthMode()
    );
  }
  /* =========================================================
     2026 KPSS COUNTDOWN + APP HEALTH
  ========================================================= */

  function updateExamCountdown() {
    const target = new Date(CFG.EXAM_DATE || "2026-10-04T10:15:00+03:00");
    const now = new Date();
    const ms = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);

    const candidates = [
      $("exam-countdown"),
      $("kpss-countdown"),
      $("dash-countdown")
    ].filter(Boolean);

    candidates.forEach(el => {
      el.textContent = ms > 0
        ? `${days}g ${hours}s ${mins}dk`
        : "Sınav zamanı geldi";
    });
  }

  function installExamCountdown() {
    updateExamCountdown();
    setInterval(updateExamCountdown, 60000);
  }

  function installAppDiagnostics() {
    window.YURDUNUBIL_DEBUG = {
      supabase: Boolean(sb),
      leaflet: typeof L !== "undefined",
      provinces: PROVINCES.length,
      questions: QUESTIONS.length,
      topics: TOPICS.length,
      geojson: () => Boolean(geoCache)
    };

    if (!PROVINCES.length) console.warn("Yurdunu Bil: provinces.js verisi yüklenmemiş.");
    if (!TOPICS.length) console.warn("Yurdunu Bil: topics.js verisi yüklenmemiş.");
    if (!QUESTIONS.length) console.warn("Yurdunu Bil: questions.js verisi yüklenmemiş.");
  }

  /* =========================================================
     START
  ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {
        once: true
      }
    );
  } else {
    boot();
  }

})();

