/**
 * Domain formatters and helpers for FoodLoop
 */

export function formatDeadline(dateString) {
  if (!dateString) return 'No deadline set';
  const target = new Date(dateString);
  const now = new Date('2026-10-10T12:00:00Z'); // Fixed baseline matching mock context or current time
  const diffMs = target - now;

  if (diffMs < 0) {
    return 'Expired';
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours < 1) {
    return `Closes in ${diffMinutes}m`;
  }
  if (diffHours < 24) {
    return `Closes in ${diffHours}h ${diffMinutes > 0 ? `${diffMinutes}m` : ''}`;
  }
  const days = Math.floor(diffHours / 24);
  return `Closes in ${days}d (${target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatTimeRange(startIso, endIso) {
  if (!startIso || !endIso) return 'Flexible window';
  const s = new Date(startIso);
  const e = new Date(endIso);
  const timeS = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const timeE = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dayS = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${dayS}, ${timeS} – ${timeE}`;
}

export function getStatusBadgeProps(status) {
  switch (status?.toLowerCase()) {
    case 'published':
    case 'available':
      return { label: 'Available Now', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'allocated':
    case 'pending':
      return { label: 'Pending Review', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    case 'approved':
    case 'accepted':
      return { label: 'Approved', color: 'bg-blue-50 text-blue-800 border-blue-200' };
    case 'en_route':
      return { label: 'Courier En Route', color: 'bg-purple-50 text-purple-800 border-purple-200' };
    case 'collected':
      return { label: 'Collected', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    case 'delivered':
    case 'completed':
      return { label: 'Completed', color: 'bg-forest-50 text-forest-800 border-forest-200' };
    case 'rejected':
    case 'cancelled':
      return { label: 'Cancelled', color: 'bg-rose-50 text-rose-800 border-rose-200' };
    case 'expired':
      return { label: 'Expired', color: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200' };
    case 'verified':
      return { label: 'Verified Partner', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'unverified':
      return { label: 'Pending Verification', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    default:
      return { label: status || 'Unknown', color: 'bg-ivory-300 text-charcoal-700 border-ivory-400' };
  }
}

export function getCategoryBadgeProps(category) {
  switch (category?.toLowerCase()) {
    case 'prepared':
      return { label: 'Prepared Meals', icon: 'ChefHat', color: 'bg-terracotta-50 text-terracotta-800 border-terracotta-200' };
    case 'bakery':
      return { label: 'Bakery & Bread', icon: 'Wheat', color: 'bg-amber-50 text-amber-900 border-amber-200' };
    case 'produce':
      return { label: 'Fresh Produce', icon: 'Apple', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
    case 'dairy':
      return { label: 'Dairy & Chilled', icon: 'Milk', color: 'bg-sky-50 text-sky-900 border-sky-200' };
    case 'packaged':
      return { label: 'Pantry / Dry', icon: 'Package', color: 'bg-sage-50 text-sage-900 border-sage-200' };
    default:
      return { label: category || 'Food Item', icon: 'Utensils', color: 'bg-ivory-200 text-charcoal-800 border-ivory-400' };
  }
}

/**
 * Calculates straight-line distance in km between two lat/lng coordinates (Haversine formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal
}
