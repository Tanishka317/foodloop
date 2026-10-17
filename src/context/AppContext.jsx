
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { StorageAdapter } from '../services/storageAdapter';

import {
  donationService,
  requestService,
  pickupService
} from '../services/apiServices';

import { PLATFORM_IMPACT_STATS } from '../data/fixtures';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Auth & Role State
  const [currentRole, setCurrentRole] = useState(
    () => StorageAdapter.getActiveRole()
  );

  const [users, setUsers] = useState(
    () => StorageAdapter.getUsers()
  );

  const [organizations, setOrganizations] = useState(
    () => StorageAdapter.getOrganizations()
  );

  // Domain Entity State
  const [donations, setDonations] = useState(
    () => StorageAdapter.getDonations()
  );

  const [loadingDonations, setLoadingDonations] = useState(true);
  const [donationsError, setDonationsError] = useState(null);

  const [requests, setRequests] = useState(
    () => StorageAdapter.getRequests()
  );

  const [pickups, setPickups] = useState(
    () => StorageAdapter.getPickups()
  );

  const [notifications, setNotifications] = useState(
    () => StorageAdapter.getNotifications()
  );

  const [reports, setReports] = useState(
    () => StorageAdapter.getReports()
  );

  // UI Toast State
  const [toasts, setToasts] = useState([]);

  // Load donations from the backend API on initial mount
  useEffect(() => {
    let cancelled = false;

    async function loadDonations() {
      try {
        setLoadingDonations(true);
        setDonationsError(null);

        const data = await donationService.getDonations();

        if (!cancelled) {
          setDonations(data);
        }
      } catch (error) {
        if (!cancelled) {
          setDonationsError(
            error.message || 'Failed to load donations'
          );

          console.error('Failed to load donations:', error);
        }
      } finally {
        if (!cancelled) {
          setLoadingDonations(false);
        }
      }
    }

    loadDonations();

    return () => {
      cancelled = true;
    };
  }, []);

  // Compute active user and organization based on role
  const currentUser =
    users.find((u) => u.role === currentRole) || users[0];

  const currentOrg =
    organizations.find(
      (o) => o.id === currentUser?.organizationId
    ) || null;

  // Add a toast alert
  const addToast = useCallback(
    (title, type = 'success', description = '') => {
      const id = `toast_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 6)}`;

      setToasts((prev) => [
        ...prev,
        { id, title, type, description }
      ]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.filter((t) => t.id !== id)
        );
      }, 4500);
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Switch demo role
  const switchRole = useCallback(
    (newRole) => {
      setCurrentRole(newRole);
      StorageAdapter.saveActiveRole(newRole);

      addToast(
        `Switched active persona to ${newRole.toUpperCase()}`,
        'info'
      );
    },
    [addToast]
  );

  // Donations management
  const createDonation = async (donationData) => {
    console.log("Current organization:", currentOrg);
    try {
      if (!currentOrg) {
        throw new Error(
          'No active organization found. Please switch to a donor profile.'
        );
      }

      const dbDonorId = StorageAdapter.getDatabaseOrgId(currentOrg);

      if (!dbDonorId) {
        throw new Error(
          `Cannot create donation: No valid database organization mapping found for active donor "${currentOrg.name}" (${currentOrg.id}).`
        );
      }

      const created = await donationService.createDonation({
        ...donationData,
        donorId: dbDonorId,
        donorName: currentOrg.name
      });

      setDonations((prev) => [created, ...prev]);

      const newNotif = {
        id: `notif_${Date.now()}`,
        role: 'ngo',
        title: 'New Surplus Donation Posted',
        message: `${created.donorName || currentOrg.name} listed ${created.quantity} ${created.unit} of "${created.title}".`,
        time: 'Just now',
        unread: true,
        link: `/app/ngo/donations/${created.id}`
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        StorageAdapter.saveNotifications(updated);
        return updated;
      });

      addToast(
        'Donation successfully published to FoodLoop network!',
        'success'
      );

      return created;
    } catch (err) {
      addToast(
        err.message || 'Failed to create donation',
        'error'
      );
      throw err;
    }
  };

  const updateDonationStatus = async (id, status) => {
    try {
      const updated = await donationService.updateDonation(
        id,
        { status }
      );

      setDonations((prev) =>
        prev.map((d) => (d.id === id ? updated : d))
      );

      addToast(
        `Donation status updated to ${status}`,
        'success'
      );

      return updated;
    } catch (err) {
      addToast(
        err.message || 'Error updating donation',
        'error'
      );
      throw err;
    }
  };

  // Requests management
  const submitRequest = async ({
    donationId,
    requestedQuantity,
    pickupWindow,
    notes
  }) => {
    try {
      const donation = donations.find(
        (d) => d.id === donationId
      );

      if (!donation) {
        throw new Error('Donation not found');
      }

      const createdReq = await requestService.createRequest({
        donationId,
        donationTitle: donation.title,
        requestingOrganizationId: currentOrg
          ? currentOrg.id
          : 'org_ngo_1',
        requestingOrganizationName: currentOrg
          ? currentOrg.name
          : 'Hope Community Kitchen & Shelter',
        requestedQuantity,
        requestedUnit: donation.unit,
        pickupWindow,
        notes
      });

      setRequests((prev) => [createdReq, ...prev]);

      // If instant claim workflow, automatically approve
      if (donation.workflowType === 'instant_claim') {
        await approveRequest(
          createdReq.id,
          'Instant allocation granted by system rules.'
        );
      } else {
        const donorNotif = {
          id: `notif_${Date.now()}`,
          role: 'donor',
          title: 'Incoming Request for Surplus Food',
          message: `${createdReq.requestingOrganizationName} requested ${requestedQuantity} ${donation.unit} of "${donation.title}".`,
          time: 'Just now',
          unread: true,
          link: '/app/donor/requests'
        };

        setNotifications((prev) => {
          const updated = [donorNotif, ...prev];
          StorageAdapter.saveNotifications(updated);
          return updated;
        });
      }

      addToast(
        'Request submitted successfully to donor!',
        'success'
      );

      return createdReq;
    } catch (err) {
      addToast(
        err.message || 'Failed to submit request',
        'error'
      );
      throw err;
    }
  };

  const approveRequest = async (
    requestId,
    approvalNote = ''
  ) => {
    try {
      const req = requests.find(
        (r) => r.id === requestId
      );

      if (!req) return;

      const updatedReq =
        await requestService.updateRequestStatus(
          requestId,
          'approved',
          { approvalNote }
        );

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? updatedReq : r
        )
      );

      // Mark donation as allocated
      await donationService.updateDonation(
        req.donationId,
        { status: 'allocated' }
      );

      setDonations((prev) =>
        prev.map((d) =>
          d.id === req.donationId
            ? { ...d, status: 'allocated' }
            : d
        )
      );

      // Generate a corresponding Pickup Task
      const donation = donations.find(
        (d) => d.id === req.donationId
      );

      const newPickup = {
        id: `pk_${Date.now()}`,
        requestId: req.id,
        donationId: req.donationId,
        donationTitle: req.donationTitle,
        donorId: donation?.donorId || 'org_donor_1',
        donorName: donation?.donorName || 'Donor Kitchen',
        donorAddress:
          donation?.pickupAddress || 'Address on file',
        recipientId: req.requestingOrganizationId,
        recipientName: req.requestingOrganizationName,
        recipientAddress:
          '215 6th Street, South of Market',
        volunteerId: 'usr_vol_1',
        volunteerName: "David O'Connor",
        volunteerPhone: '+1 (555) 890-1234',
        status: 'assigned',
        verificationCode: `FL-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        scheduledPickupTime: new Date(
          Date.now() + 2 * 3600 * 1000
        ).toISOString(),
        scheduledDeliveryTime: new Date(
          Date.now() + 4 * 3600 * 1000
        ).toISOString(),
        temperatureCheckPassed: true,
        transportVehicle: 'Cargo Van',
        notes:
          approvalNote || 'Please collect before deadline.',
        timeline: [
          {
            stage: 'assigned',
            time: new Date().toISOString(),
            label: 'Pickup Task Assigned to Volunteer'
          }
        ]
      };

      const updatedPickups = [newPickup, ...pickups];

      setPickups(updatedPickups);
      StorageAdapter.savePickups(updatedPickups);

      // Add notifications to NGO and Volunteer
      const ngoNotif = {
        id: `notif_${Date.now()}_ngo`,
        role: 'ngo',
        title: 'Donation Claim Approved!',
        message: `Your request for "${req.donationTitle}" was approved. Pickup code: ${newPickup.verificationCode}.`,
        time: 'Just now',
        unread: true,
        link: '/app/ngo/pickups'
      };

      const volNotif = {
        id: `notif_${Date.now()}_vol`,
        role: 'volunteer',
        title: 'New Pickup Task Dispatched',
        message: `New rescue task: Collect from ${newPickup.donorName} for ${newPickup.recipientName}.`,
        time: 'Just now',
        unread: true,
        link: `/app/volunteer/tasks/${newPickup.id}`
      };

      setNotifications((prev) => {
        const updated = [ngoNotif, volNotif, ...prev];
        StorageAdapter.saveNotifications(updated);
        return updated;
      });

      addToast(
        'Request approved! Pickup task created and volunteer notified.',
        'success'
      );
    } catch (err) {
      addToast(
        err.message || 'Failed to approve request',
        'error'
      );
    }
  };

  const rejectRequest = async (
    requestId,
    reason = ''
  ) => {
    try {
      const updatedReq =
        await requestService.updateRequestStatus(
          requestId,
          'rejected',
          { rejectionReason: reason }
        );

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? updatedReq : r
        )
      );

      addToast('Request declined', 'info');
    } catch (err) {
      addToast(
        err.message || 'Failed to reject request',
        'error'
      );
    }
  };

  // Pickup status progression
  const updatePickupStatus = async (
    pickupId,
    nextStage
  ) => {
    try {
      const updated = await pickupService.updatePickupStatus(
        pickupId,
        nextStage
      );

      setPickups((prev) =>
        prev.map((p) =>
          p.id === pickupId ? updated : p
        )
      );

      // If delivered, mark donation and request as completed
      if (nextStage === 'delivered') {
        const pk = pickups.find(
          (p) => p.id === pickupId
        );

        if (pk) {
          await donationService.updateDonation(
            pk.donationId,
            { status: 'completed' }
          );

          setDonations((prev) =>
            prev.map((d) =>
              d.id === pk.donationId
                ? { ...d, status: 'completed' }
                : d
            )
          );

          await requestService.updateRequestStatus(
            pk.requestId,
            'completed'
          );

          setRequests((prev) =>
            prev.map((r) =>
              r.id === pk.requestId
                ? { ...r, status: 'completed' }
                : r
            )
          );
        }
      }

      addToast(
        `Pickup status progressed to: ${nextStage
          .replace('_', ' ')
          .toUpperCase()}`,
        'success'
      );

      return updated;
    } catch (err) {
      addToast(
        err.message || 'Failed to update pickup status',
        'error'
      );
    }
  };

  // Organization verification (Admin action)
  const setOrganizationVerification = (
    orgId,
    verified
  ) => {
    setOrganizations((prev) => {
      const updated = prev.map((o) =>
        o.id === orgId
          ? {
              ...o,
              verified,
              verificationDate: verified
                ? new Date().toISOString().split('T')[0]
                : null
            }
          : o
      );

      StorageAdapter.saveOrganizations(updated);
      return updated;
    });

    addToast(
      `Organization ${
        verified ? 'Verified & Approved' : 'Rejected'
      }`,
      'info'
    );
  };

  // Notifications
  const markNotificationRead = (notifId) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notifId ? { ...n, unread: false } : n
      );

      StorageAdapter.saveNotifications(updated);
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({
        ...n,
        unread: false
      }));

      StorageAdapter.saveNotifications(updated);
      return updated;
    });

    addToast('All notifications marked as read', 'info');
  };

  // Profile update
  const updateCurrentUserProfile = (profileData) => {
    setUsers((prev) => {
      const updated = prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, ...profileData }
          : u
      );

      StorageAdapter.saveUsers(updated);
      return updated;
    });

    if (currentOrg && profileData.orgName) {
      setOrganizations((prev) => {
        const updated = prev.map((o) =>
          o.id === currentOrg.id
            ? {
                ...o,
                name: profileData.orgName,
                address:
                  profileData.orgAddress || o.address
              }
            : o
        );

        StorageAdapter.saveOrganizations(updated);
        return updated;
      });
    }

    addToast(
      'Profile changes saved successfully',
      'success'
    );
  };

  // Reset demo fixtures
  const resetAllDemoData = () => {
    StorageAdapter.resetToDefault();

    setUsers(StorageAdapter.getUsers());
    setOrganizations(StorageAdapter.getOrganizations());

    // Reload donations from the backend rather than LocalStorage
    setLoadingDonations(true);
    setDonationsError(null);

    donationService
      .getDonations()
      .then((data) => {
        setDonations(data);
      })
      .catch((error) => {
        setDonationsError(
          error.message || 'Failed to load donations'
        );
        addToast('Failed to reload donations from server', 'error');
      })
      .finally(() => {
        setLoadingDonations(false);
      });

    setRequests(StorageAdapter.getRequests());
    setPickups(StorageAdapter.getPickups());
    setNotifications(StorageAdapter.getNotifications());
    setReports(StorageAdapter.getReports());

    addToast(
      'Demo environment reset to initial seed state',
      'info'
    );
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => n.role === currentRole && n.unread
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        currentUser,
        currentOrg,
        users,
        organizations,

        donations,
        loadingDonations,
        donationsError,

        requests,
        pickups,
        notifications,
        unreadNotificationsCount,
        reports,
        impactStats: PLATFORM_IMPACT_STATS,
        toasts,
        addToast,
        removeToast,
        createDonation,
        updateDonationStatus,
        submitRequest,
        approveRequest,
        rejectRequest,
        updatePickupStatus,
        setOrganizationVerification,
        markNotificationRead,
        markAllNotificationsRead,
        updateCurrentUserProfile,
        resetAllDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
}
