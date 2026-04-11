const STORAGE_KEYS = {
  listings: 'foodListings',
  claims: 'userClaims',
  notifications: 'platformNotifications',
};

const DEFAULT_USER_LOCATION = [28.7041, 77.1025];

const seededListings = [
  {
    id: 1001,
    title: 'Fresh Vegetables Mix',
    description: 'Sorted surplus tomatoes, spinach, carrots, and beans packed for same-day pickup.',
    provider: 'Green Mart Store',
    price: 150,
    quantity: '12 meal kits',
    category: 'vegetables',
    coordinates: [28.7041, 77.1025],
    image: '🥬',
    postedAt: '2026-04-11T04:15:00.000Z',
    expiresAt: '2026-04-11T10:30:00.000Z',
    pickupWindow: 'Before 04:00 PM',
    ngoPriority: 'high',
    freshnessBand: 'Same-day rescue',
    notificationChannels: ['Push', 'SMS'],
    foodSafetyLevel: 'Low risk',
    complianceScore: 96,
    providerRating: 4.8,
    reviewCount: 126,
    deliveryWindowMins: 24,
    trafficIntensity: 1.12,
    safetyGuidelines: [
      'Keep produce ventilated and away from direct sunlight.',
      'Rinse before redistribution or cooking.',
      'Deliver within 3 hours for best freshness.',
    ],
    complianceChecklist: [
      { label: 'Packed in clean crates', complete: true },
      { label: 'Temperature log recorded', complete: true },
      { label: 'Allergen risk verified', complete: true },
    ],
  },
  {
    id: 1002,
    title: 'Cooked Rice and Curry',
    description: 'Freshly packed lunch trays from today service, suited for immediate community dispatch.',
    provider: 'Local Restaurant',
    price: 200,
    quantity: '18 trays',
    category: 'cooked',
    coordinates: [28.6139, 77.209],
    image: '🍛',
    postedAt: '2026-04-11T05:00:00.000Z',
    expiresAt: '2026-04-11T08:45:00.000Z',
    pickupWindow: 'Before 02:15 PM',
    ngoPriority: 'critical',
    freshnessBand: 'Hot holding required',
    notificationChannels: ['Push', 'SMS', 'Email'],
    foodSafetyLevel: 'High attention',
    complianceScore: 91,
    providerRating: 4.6,
    reviewCount: 208,
    deliveryWindowMins: 16,
    trafficIntensity: 1.28,
    safetyGuidelines: [
      'Consume within 2 hours of pickup.',
      'Keep hot food above 60 C during transport.',
      'Do not redistribute if seal is broken.',
    ],
    complianceChecklist: [
      { label: 'Cooked less than 4 hours ago', complete: true },
      { label: 'Tamper-safe containers used', complete: true },
      { label: 'Hot-chain instructions attached', complete: true },
    ],
  },
  {
    id: 1003,
    title: 'Bakery Items Bread and Muffins',
    description: 'Unsold bakery pack with whole wheat loaves and breakfast muffins in sealed sleeves.',
    provider: 'City Bakery',
    price: 100,
    quantity: '24 assorted pieces',
    category: 'bakery',
    coordinates: [28.7275, 77.047],
    image: '🥖',
    postedAt: '2026-04-11T03:40:00.000Z',
    expiresAt: '2026-04-11T12:00:00.000Z',
    pickupWindow: 'Before 05:30 PM',
    ngoPriority: 'medium',
    freshnessBand: 'Dry goods stable',
    notificationChannels: ['Push', 'Email'],
    foodSafetyLevel: 'Low risk',
    complianceScore: 98,
    providerRating: 4.9,
    reviewCount: 89,
    deliveryWindowMins: 28,
    trafficIntensity: 1.05,
    safetyGuidelines: [
      'Store in dry, covered containers.',
      'Separate sweet and savory items to avoid cross-contact.',
      'Redistribute before end of day.',
    ],
    complianceChecklist: [
      { label: 'Sealed packaging intact', complete: true },
      { label: 'Batch label attached', complete: true },
      { label: 'Dry storage maintained', complete: true },
    ],
  },
  {
    id: 1004,
    title: 'Fresh Fruits Combo',
    description: 'Bananas, apples, and seasonal fruit boxes ideal for NGO outreach packs.',
    provider: 'Organic Fruits Store',
    price: 180,
    quantity: '15 family boxes',
    category: 'fruits',
    coordinates: [28.6692, 77.0601],
    image: '🍎',
    postedAt: '2026-04-11T04:50:00.000Z',
    expiresAt: '2026-04-11T13:30:00.000Z',
    pickupWindow: 'Before 07:00 PM',
    ngoPriority: 'medium',
    freshnessBand: 'Best within 8 hours',
    notificationChannels: ['Push'],
    foodSafetyLevel: 'Low risk',
    complianceScore: 94,
    providerRating: 4.7,
    reviewCount: 173,
    deliveryWindowMins: 22,
    trafficIntensity: 1.08,
    safetyGuidelines: [
      'Avoid stacking heavy boxes over soft fruit.',
      'Discard bruised fruit before redistribution.',
      'Keep shaded during transport.',
    ],
    complianceChecklist: [
      { label: 'Quality sorted before posting', complete: true },
      { label: 'Clean reusable crates used', complete: true },
      { label: 'Pickup team briefed on handling', complete: false },
    ],
  },
];

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Unable to parse storage for ${key}`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('foodcycle-storage'));
};

export const getCurrentUserLabel = (user) =>
  user?.displayName || user?.email?.split('@')[0] || 'Community partner';

export const calculateDistanceKm = (from, to) => {
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  const radius = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((radius * c).toFixed(2));
};

export const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(0)}`;

export const getTimeRemaining = (expiresAt) => {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) {
    return { expired: true, label: 'Expired', minutes: 0 };
  }
  const totalMinutes = Math.ceil(diffMs / 60000);
  if (totalMinutes < 60) {
    return { expired: false, label: `${totalMinutes} min left`, minutes: totalMinutes };
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    expired: false,
    label: `${hours}h ${minutes}m left`,
    minutes: totalMinutes,
  };
};

export const getExpiryUrgency = (expiresAt) => {
  const remaining = getTimeRemaining(expiresAt);
  if (remaining.expired) {
    return { level: 'expired', label: 'Expired', color: '#A32D2D' };
  }
  if (remaining.minutes <= 90) {
    return { level: 'critical', label: 'Critical', color: '#C84B31' };
  }
  if (remaining.minutes <= 240) {
    return { level: 'priority', label: 'Priority', color: '#C58718' };
  }
  return { level: 'stable', label: 'Stable', color: '#2D7B4F' };
};

export const buildOptimizedRoute = (listing, userLocation = DEFAULT_USER_LOCATION) => {
  const distanceKm = calculateDistanceKm(userLocation, listing.coordinates || DEFAULT_USER_LOCATION);
  const urgency = getTimeRemaining(listing.expiresAt);
  const trafficFactor = listing.trafficIntensity || 1.1;
  const etaMinutes = Math.max(8, Math.round(distanceKm * 7 * trafficFactor));
  const freshnessFactor = urgency.expired ? 0 : Math.max(0.5, Math.min(1.5, 180 / Math.max(urgency.minutes, 30)));
  const routeScore = Math.round((100 / (1 + distanceKm)) * freshnessFactor * (2 - Math.min(trafficFactor, 1.5)));
  return {
    distanceKm,
    etaMinutes,
    routeScore,
    trafficLabel: trafficFactor > 1.2 ? 'Heavy traffic' : trafficFactor > 1.08 ? 'Moderate traffic' : 'Clear route',
    recommendation:
      routeScore >= 55 ? 'Recommended for immediate dispatch' : routeScore >= 35 ? 'Viable if volunteer is nearby' : 'Low priority route',
  };
};

const normaliseListing = (listing) => {
  const priceValue = Number(String(listing.price ?? 0).replace(/[^\d.]/g, '')) || 0;
  const coordinates = Array.isArray(listing.coordinates) && listing.coordinates.length === 2
    ? listing.coordinates
    : DEFAULT_USER_LOCATION;
  return {
    ...listing,
    price: priceValue,
    coordinates,
    image: listing.image || '🍱',
    postedAt: listing.postedAt || new Date().toISOString(),
    expiresAt: listing.expiresAt || new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    pickupWindow: listing.pickupWindow || 'Today',
    ngoPriority: listing.ngoPriority || 'medium',
    freshnessBand: listing.freshnessBand || 'Same-day rescue',
    notificationChannels: listing.notificationChannels || ['Push'],
    foodSafetyLevel: listing.foodSafetyLevel || 'Standard handling',
    complianceScore: Number(listing.complianceScore ?? 90),
    providerRating: Number(listing.providerRating ?? 4.7),
    reviewCount: Number(listing.reviewCount ?? 0),
    deliveryWindowMins: Number(listing.deliveryWindowMins ?? 25),
    trafficIntensity: Number(listing.trafficIntensity ?? 1.1),
    safetyGuidelines: listing.safetyGuidelines || [
      'Maintain clean packaging.',
      'Complete pickup within assigned freshness window.',
      'Document handoff at delivery.',
    ],
    complianceChecklist: listing.complianceChecklist || [
      { label: 'Packaging verified', complete: true },
      { label: 'Handling note attached', complete: true },
      { label: 'Volunteer assignment ready', complete: false },
    ],
  };
};

export const getListings = () => {
  const storedListings = readJson(STORAGE_KEYS.listings, []);
  return [...seededListings, ...storedListings]
    .map(normaliseListing)
    .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
};

export const saveListing = (listing) => {
  const listings = readJson(STORAGE_KEYS.listings, []);
  listings.push(listing);
  writeJson(STORAGE_KEYS.listings, listings);
};

export const getClaims = () => readJson(STORAGE_KEYS.claims, []);

export const getNotifications = () =>
  readJson(STORAGE_KEYS.notifications, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const createNotification = (notification) => {
  const notifications = getNotifications();
  notifications.push(notification);
  writeJson(STORAGE_KEYS.notifications, notifications);
};

export const saveClaim = (claimData) => {
  const claims = getClaims();
  claims.push(claimData);
  writeJson(STORAGE_KEYS.claims, claims);
};

export const createClaimRecord = ({ listing, user, contact }) => {
  const route = buildOptimizedRoute(listing);
  const claim = {
    id: Date.now(),
    listingId: listing.id,
    title: listing.title,
    provider: listing.provider,
    claimant: getCurrentUserLabel(user),
    price: formatCurrency(listing.price),
    name: contact.name,
    mobile: contact.mobile,
    address: contact.address,
    notificationPreference: contact.notificationPreference,
    coordinates: listing.coordinates,
    claimedAt: new Date().toISOString(),
    status: 'pending',
    etaMinutes: route.etaMinutes,
    distanceKm: route.distanceKm,
    routeScore: route.routeScore,
    trafficLabel: route.trafficLabel,
    expiryLabel: getTimeRemaining(listing.expiresAt).label,
    safetyGuidelines: listing.safetyGuidelines,
    complianceScore: listing.complianceScore,
    providerRating: listing.providerRating,
  };

  saveClaim(claim);

  const channels = Array.isArray(contact.notificationPreference)
    ? contact.notificationPreference
    : [contact.notificationPreference];
  channels.forEach((channel) => {
    createNotification({
      id: `${claim.id}-${channel}`,
      channel,
      title: `${listing.title} claimed`,
      message: `${claim.claimant} started the pickup flow. ETA ${route.etaMinutes} min via ${route.trafficLabel.toLowerCase()}.`,
      createdAt: new Date().toISOString(),
      listingId: listing.id,
      severity: getExpiryUrgency(listing.expiresAt).level,
    });
  });

  return claim;
};

export const getDashboardMetrics = (user) => {
  const currentUser = getCurrentUserLabel(user);
  const claims = getClaims();
  const listings = getListings();
  const notifications = getNotifications();

  const myListings = listings.filter((listing) => listing.provider === currentUser);
  const myClaims = claims.filter((claim) => claim.claimant === currentUser || claim.name === currentUser);

  const activeListings = myListings.filter((listing) => !getTimeRemaining(listing.expiresAt).expired).length;
  const rescuedMeals = myClaims.reduce((count, claim) => count + 1, 0) * 8;
  const avgCompliance = myListings.length
    ? Math.round(myListings.reduce((sum, listing) => sum + Number(listing.complianceScore || 0), 0) / myListings.length)
    : 0;
  const avgTrust = myListings.length
    ? (
        myListings.reduce((sum, listing) => sum + Number(listing.providerRating || 0), 0) / myListings.length
      ).toFixed(1)
    : '0.0';

  return {
    myListings,
    myClaims,
    notifications: notifications.slice(0, 6),
    stats: {
      activeListings,
      rescuedMeals,
      avgCompliance,
      avgTrust,
    },
  };
};

export const getDefaultUserLocation = () => DEFAULT_USER_LOCATION;
