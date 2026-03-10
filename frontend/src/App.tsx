import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { API_URL, api } from './api';
import type { LeaderboardRow, Mission, ParentRow, PlayerProfile, Stats, User } from './types';

type Tab = 'dashboard' | 'missions' | 'leaderboard' | 'parent' | 'account';

const AGE_GROUPS = ['5-8', '9-12', '13-17', '18-22'] as const;

export function App() {
  const [token, setToken] = useState(localStorage.getItem('missionz_token') || '');
  const [mode, setMode] = useState<'login' | 'register'>('register');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState<(typeof AGE_GROUPS)[number]>('5-8');
  const [parentEmail, setParentEmail] = useState('');

  const [stats, setStats] = useState<Stats | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [parentRows, setParentRows] = useState<ParentRow[]>([]);

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [missionProof, setMissionProof] = useState<Record<number, string>>({});
  const [missionProofType, setMissionProofType] = useState<Record<number, 'image' | 'video'>>({});

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function saveToken(next: string) {
    setToken(next);
    localStorage.setItem('missionz_token', next);
  }

  function logout() {
    localStorage.removeItem('missionz_token');
    setToken('');
    setUser(null);
    setProfile(null);
    setStats(null);
    setMissions([]);
    setLeaderboard([]);
    setParentRows([]);
    setMessage('Logged out');
  }

  async function bootstrap() {
    if (!token) return;
    try {
      const me = await api<User>('/api/auth/me');
      setUser(me);

      try {
        const p = await api<PlayerProfile>('/api/player/profile');
        setProfile(p);
      } catch {
        setProfile(null);
      }
    } catch {
      logout();
    }
  }

  async function refreshGameData() {
    if (!token || !profile) return;
    const [s, m, l, p] = await Promise.all([
      api<Stats>('/api/player/stats'),
      api<Mission[]>('/api/missions/available'),
      api<LeaderboardRow[]>('/api/leaderboard/global'),
      api<ParentRow[]>('/api/parent/dashboard'),
    ]);
    setStats(s);
    setMissions(m);
    setLeaderboard(l);
    setParentRows(p);
  }

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    refreshGameData().catch((err: Error) => setMessage(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  async function onAuthSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'register') {
        const res = await api<{ access_token: string }>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, full_name: fullName }),
        });
        saveToken(res.access_token);
        setMessage('Registered successfully');
      } else {
        const res = await api<{ access_token: string }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        saveToken(res.access_token);
        setMessage('Logged in successfully');
      }
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onCreateProfile(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        nickname,
        age_group: ageGroup,
        parent_email: ['5-8', '9-12'].includes(ageGroup) ? parentEmail : null,
      };
      const p = await api<PlayerProfile>('/api/player/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setProfile(p);
      setMessage('Profile created');
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function startMission(missionId: number) {
    setLoading(true);
    setMessage('');
    try {
      await api<{ message: string }>('/api/missions/start', {
        method: 'POST',
        body: JSON.stringify({ mission_id: missionId }),
      });
      setMessage('Mission started');
      await refreshGameData();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function onMissionFileChange(missionId: number, evt: ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setMissionProof((prev) => ({ ...prev, [missionId]: result.replace(/^data:.+;base64,/, '') }));
      setMissionProofType((prev) => ({ ...prev, [missionId]: isVideo ? 'video' : 'image' }));
    };
    reader.readAsDataURL(file);
  }

  async function submitMission(missionId: number) {
    const proof = missionProof[missionId];
    if (!proof) {
      setMessage('Attach image/video proof first');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await api<{ verified: boolean; feedback: string; new_level?: number; new_stage?: string }>(
        '/api/missions/submit',
        {
          method: 'POST',
          body: JSON.stringify({
            mission_id: missionId,
            proof_base64: proof,
            proof_type: missionProofType[missionId] || 'image',
          }),
        }
      );
      setMessage(res.verified ? `Verified. Level ${res.new_level} (${res.new_stage})` : `Not verified: ${res.feedback}`);
      await refreshGameData();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyParentLink() {
    if (!profile || !parentEmail) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await api<{ message: string }>('/api/parent/link', {
        method: 'POST',
        body: JSON.stringify({ child_player_id: profile.id, parent_email: parentEmail }),
      });
      setMessage(res.message);
      const updated = await api<PlayerProfile>('/api/player/profile');
      setProfile(updated);
      await refreshGameData();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const needsProfile = token && user && !profile;
  const missionByStatus = useMemo(() => {
    return {
      available: missions.filter((m) => m.status === 'available'),
      active: missions.filter((m) => m.status === 'active'),
      completed: missions.filter((m) => m.status === 'completed'),
    };
  }, [missions]);

  if (!token || !user) {
    return (
      <main className="shell">
        <section className="card auth-card">
          <h1>MissionZ: Grow to Hero</h1>
          <p className="muted">Backend: {API_URL}</p>
          <p className="muted">Build your real-life mission game journey.</p>

          <div className="switch-row">
            <button className={mode === 'register' ? 'btn active' : 'btn'} onClick={() => setMode('register')}>
              Register
            </button>
            <button className={mode === 'login' ? 'btn active' : 'btn'} onClick={() => setMode('login')}>
              Login
            </button>
          </div>

          <form onSubmit={onAuthSubmit} className="stack">
            {mode === 'register' && (
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" required />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
            />
            <button disabled={loading} className="btn primary" type="submit">
              {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {message && <p className="message">{message}</p>}
        </section>
      </main>
    );
  }

  if (needsProfile) {
    return (
      <main className="shell">
        <section className="card auth-card">
          <h2>Create Player Profile</h2>
          <form onSubmit={onCreateProfile} className="stack">
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nickname" required />
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as (typeof AGE_GROUPS)[number])}>
              {AGE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {['5-8', '9-12'].includes(ageGroup) && (
              <input
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                type="email"
                placeholder="Parent email (required for age 5-12)"
                required
              />
            )}
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
          </form>
          {message && <p className="message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <header className="topbar card">
        <div>
          <h1>MissionZ</h1>
          <p className="muted">
            {user.full_name} | {profile?.nickname} | {profile?.stage} Lv.{profile?.level}
          </p>
        </div>
        <div className="topbar-actions">
          <button className="btn" onClick={() => refreshGameData()}>
            Refresh
          </button>
          <button className="btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="tabs">
        {(['dashboard', 'missions', 'leaderboard', 'parent', 'account'] as Tab[]).map((tab) => (
          <button key={tab} className={activeTab === tab ? 'btn active' : 'btn'} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      {message && <p className="message">{message}</p>}

      {activeTab === 'dashboard' && (
        <section className="grid">
          <article className="card">
            <h3>Progress</h3>
            <p>XP: {stats?.xp ?? 0}</p>
            <p>Coins: {stats?.coins ?? 0}</p>
            <p>Level: {stats?.level ?? 1}</p>
            <p>Stage: {stats?.stage ?? 'Beginner'}</p>
            <p>Completed: {stats?.completed_missions ?? 0}</p>
          </article>
          <article className="card">
            <h3>Mission Status</h3>
            <p>Available: {missionByStatus.available.length}</p>
            <p>Active: {missionByStatus.active.length}</p>
            <p>Completed: {missionByStatus.completed.length}</p>
          </article>
        </section>
      )}

      {activeTab === 'missions' && (
        <section className="stack">
          {missions.map((mission) => (
            <article key={mission.id} className="card">
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
              <p className="muted">
                {mission.category} | {mission.difficulty} | +{mission.xp_reward} XP | +{mission.coins_reward} coins
              </p>
              <p>
                Status: <strong>{mission.status}</strong>
              </p>

              {mission.status === 'available' && (
                <button className="btn primary" onClick={() => startMission(mission.id)}>
                  Start Mission
                </button>
              )}

              {mission.status === 'active' && (
                <div className="stack">
                  <input type="file" accept="image/*,video/*" onChange={(evt) => onMissionFileChange(mission.id, evt)} />
                  <button className="btn primary" onClick={() => submitMission(mission.id)}>
                    Submit Proof
                  </button>
                </div>
              )}

              {mission.status === 'completed' && <p className="success">Completed</p>}
            </article>
          ))}
        </section>
      )}

      {activeTab === 'leaderboard' && (
        <section className="stack">
          {leaderboard.map((row) => (
            <article key={row.player_id} className="card row">
              <strong>#{row.rank}</strong>
              <span>{row.nickname}</span>
              <span>{row.stage}</span>
              <span>Lv.{row.level}</span>
              <span>{row.xp} XP</span>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'parent' && (
        <section className="stack">
          <article className="card">
            <h3>Parent Verification</h3>
            <p className="muted">For age group 5-12, verify parent email to enable parent dashboard.</p>
            <div className="row">
              <input
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                type="email"
                placeholder="Parent email"
              />
              <button className="btn primary" onClick={verifyParentLink}>
                Verify Link
              </button>
            </div>
            <p>
              Verified: <strong>{String(profile?.parent_email_verified ?? false)}</strong>
            </p>
          </article>

          <h3>Children Dashboard (if you're parent)</h3>
          {parentRows.length === 0 && <p className="muted">No linked child data yet.</p>}
          {parentRows.map((child) => (
            <article key={child.player_id} className="card">
              <h4>{child.nickname}</h4>
              <p>
                {child.age_group} | {child.stage} Lv.{child.level}
              </p>
              <p>
                XP {child.xp} | Coins {child.coins} | Completed {child.completed_missions}
              </p>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'account' && (
        <section className="card">
          <h3>Account</h3>
          <p>Name: {user.full_name}</p>
          <p>Email: {user.email}</p>
          <p>Provider: {user.provider}</p>
          <p>Role: {user.role}</p>
          <p>Player age group: {profile?.age_group}</p>
        </section>
      )}
    </main>
  );
}
