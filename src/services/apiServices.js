/**
 * API SERVICE LAYER
 *
 * Donations: Connected to the Node.js / Express / PostgreSQL backend.
 * Requests and pickups: Client-side demo implementation using LocalStorage.
 */

import { StorageAdapter } from "./storageAdapter";

// -----------------------------------------------------------------------------
// DONATION SERVICE — BACKEND API
// -----------------------------------------------------------------------------

export const donationService = {
  async getDonations(filters = {}) {
    const params = new URLSearchParams();

    // Convert frontend category slugs to backend category names.
    const categoryMap = {
      prepared: "Prepared Meals",
      bakery: "Bakery",
      produce: "Produce",
      dairy: "Dairy",
      packaged: "Packaged",
    };

    if (filters.category && filters.category !== "all") {
      params.set("category", categoryMap[filters.category] || filters.category);
    }

    if (filters.city) {
      params.set("city", filters.city);
    }

    const query = params.toString();
    const url = query ? `/api/donations?${query}` : "/api/donations";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load donations (${response.status})`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid donations response from server");
    }

    // Convert backend snake_case fields into frontend camelCase fields.
    return result.data.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description || "",

      // Keep the backend category label for display.
      category: d.category,
      categoryLabel: d.category,

      quantity: d.available_quantity ?? d.quantity,
      totalQuantity: d.quantity,
      allocatedQuantity: d.allocated_quantity ?? 0,
      unit: d.unit,

      estimatedServings: d.estimated_servings,

      pickupAddress: d.pickup_address,
      availableFrom: d.available_from,
      pickupDeadline: d.pickup_deadline,

      status: d.status,
      workflowType: d.workflow_type,

      donorName: d.donor_organization,
      donorId: d.donor_organization_id,

      dietaryTags: d.dietary_tags || [],
      allergens: d.allergens || [],
    }));
  },

  async getDonationById(id) {
    const donations = await this.getDonations();

    const donation = donations.find((d) => d.id === id);

    if (!donation) {
      throw new Error("Donation not found");
    }

    return donation;
  },

  async createDonation(donationData) {
    const payload = {
      donor_organization_id:
        donationData.donor_organization_id ?? donationData.donorId,
      title: donationData.title,
      description: donationData.description,
      category: donationData.category,
      quantity: Number(donationData.quantity),
      unit: donationData.unit,
      estimated_servings:
        donationData.estimated_servings ??
        donationData.estimatedServings ??
        null,
      estimated_weight_kg:
        donationData.estimated_weight_kg ??
        donationData.estimatedWeightKg ??
        null,
      pickup_address: donationData.pickup_address ?? donationData.pickupAddress,
      available_from: donationData.available_from ?? donationData.availableFrom,
      pickup_deadline:
        donationData.pickup_deadline ?? donationData.pickupDeadline,
      storage_instructions:
        donationData.storage_instructions ??
        donationData.storageInstructions ??
        null,
      allergens: donationData.allergens ?? [],
      dietary_tags: donationData.dietary_tags ?? donationData.dietaryTags ?? [],
      image_url: donationData.image_url ?? donationData.imageUrl ?? null,
      workflow_type: donationData.workflow_type ?? donationData.workflowType,
    };

    const response = await fetch("/api/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create donation");
    }

    const d = result.data;

    return {
      id: d.id,
      title: d.title,
      description: d.description || "",
      category: d.category,
      categoryLabel: d.category,
      quantity: d.quantity - d.allocated_quantity,
      totalQuantity: d.quantity,
      allocatedQuantity: d.allocated_quantity,
      unit: d.unit,
      estimatedServings: d.estimated_servings,
      pickupAddress: d.pickup_address,
      availableFrom: d.available_from,
      pickupDeadline: d.pickup_deadline,
      status: d.status,
      workflowType: d.workflow_type,
      donorId: d.donor_organization_id,
      dietaryTags: d.dietary_tags || [],
      allergens: d.allergens || [],
    };
  },

  async updateDonation() {
    throw new Error(
      "Updating donations through the backend is not implemented yet",
    );
  },
};

// -----------------------------------------------------------------------------
// REQUEST SERVICE — LOCALSTORAGE DEMO
// -----------------------------------------------------------------------------

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const requestService = {
  async getRequests(filters = {}) {
    await delay();

    let items = StorageAdapter.getRequests();

    if (filters.orgId) {
      items = items.filter((r) => r.requestingOrganizationId === filters.orgId);
    }

    if (filters.donationId) {
      items = items.filter((r) => r.donationId === filters.donationId);
    }

    if (filters.status && filters.status !== "all") {
      items = items.filter((r) => r.status === filters.status);
    }

    return items;
  },

  async createRequest(requestData) {
    await delay(200);

    const requests = StorageAdapter.getRequests();
    const now = new Date().toISOString();

    const newRequest = {
      ...requestData,
      id: `req_${Date.now()}`,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    requests.unshift(newRequest);
    StorageAdapter.saveRequests(requests);

    return newRequest;
  },

  async updateRequestStatus(id, newStatus, extra = {}) {
    await delay(150);

    const requests = StorageAdapter.getRequests();

    const index = requests.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error("Request not found");
    }

    requests[index] = {
      ...requests[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...extra,
    };

    StorageAdapter.saveRequests(requests);

    return requests[index];
  },
};

// -----------------------------------------------------------------------------
// PICKUP SERVICE — LOCALSTORAGE DEMO
// -----------------------------------------------------------------------------

export const pickupService = {
  async getPickups(filters = {}) {
    await delay();

    let items = StorageAdapter.getPickups();

    if (filters.volunteerId) {
      items = items.filter((p) => p.volunteerId === filters.volunteerId);
    }

    if (filters.recipientId) {
      items = items.filter((p) => p.recipientId === filters.recipientId);
    }

    if (filters.donorId) {
      items = items.filter((p) => p.donorId === filters.donorId);
    }

    return items;
  },

  async updatePickupStatus(id, newStage) {
    await delay(150);

    const items = StorageAdapter.getPickups();

    const index = items.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error("Pickup not found");
    }

    const pickup = items[index];
    const newTimeline = [...(pickup.timeline || [])];

    newTimeline.push({
      stage: newStage,
      time: new Date().toISOString(),
      label: formatStageLabel(newStage),
    });

    items[index] = {
      ...pickup,
      status: newStage,
      timeline: newTimeline,

      ...(newStage === "collected"
        ? { collectedAt: new Date().toISOString() }
        : {}),

      ...(newStage === "delivered"
        ? { deliveredAt: new Date().toISOString() }
        : {}),
    };

    StorageAdapter.savePickups(items);

    return items[index];
  },
};

// -----------------------------------------------------------------------------
// PICKUP STATUS LABELS
// -----------------------------------------------------------------------------

function formatStageLabel(stage) {
  switch (stage) {
    case "accepted":
      return "Task Accepted by Volunteer";

    case "en_route":
      return "En Route to Donor Location";

    case "collected":
      return "Surplus Food Collected & Temperature Checked";

    case "delivered":
      return "Delivered & Handed Over to Recipient";

    default:
      return `Status updated to ${stage}`;
  }
}
