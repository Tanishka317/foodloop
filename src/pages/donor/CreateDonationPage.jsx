import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Input, Select, Textarea } from '../../components/common/FormInputs';
import {
  PackagePlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

export default function CreateDonationPage() {
  const navigate = useNavigate();
  const { createDonation, currentOrg } = useApp();

  const [form, setForm] = useState({
    title: '',
    category: 'prepared',
    description: '',
    quantity: '',
    unit: 'servings',
    estimatedServings: '',
    estimatedWeightKg: '',
    pickupDeadlineHours: '6',
    storageInstructions: 'Refrigerated storage at or below 4°C. Clean food crates.',
    pickupAddress: currentOrg?.address || '442 Market Street, Loading Bay B',
    workflowType: 'request_approval',
    allergens: [],
    dietaryTags: [],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  });

  const [loading, setLoading] = useState(false);

  const sampleImages = [
    { label: 'Hot Meals / Catering', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Fresh Bakery Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
    { label: 'Fresh Farm Produce', url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Sandwiches & Wraps', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
    { label: 'Pantry / Canned Goods', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' }
  ];

  const commonAllergens = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy', 'Shellfish', 'Fish', 'Sesame'];
  const commonDietaryTags = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Kosher', 'Nut-Free'];

  const toggleAllergen = (al) => {
    setForm(prev => ({
      ...prev,
      allergens: prev.allergens.includes(al)
        ? prev.allergens.filter(x => x !== al)
        : [...prev.allergens, al]
    }));
  };

  const toggleDietary = (dt) => {
    setForm(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(dt)
        ? prev.dietaryTags.filter(x => x !== dt)
        : [...prev.dietaryTags, dt]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate pickup deadline from now
      const deadlineDate = new Date(Date.now() + Number(form.pickupDeadlineHours) * 3600 * 1000).toISOString();

      await createDonation({
        title: form.title,
        category: form.category,
        description: form.description,
        quantity: Number(form.quantity),
        unit: form.unit,
        estimatedServings: Number(form.estimatedServings || form.quantity),
        estimatedWeightKg: Number(form.estimatedWeightKg || Math.round(Number(form.quantity) * 0.4)),
        availableFrom: new Date().toISOString(),
        pickupDeadline: deadlineDate,
        storageInstructions: form.storageInstructions,
        pickupAddress: form.pickupAddress,
        latitude: currentOrg?.latitude || 37.7897,
        longitude: currentOrg?.longitude || -122.4011,
        workflowType: form.workflowType,
        allergens: form.allergens.length > 0 ? form.allergens : ['None declared'],
        dietaryTags: form.dietaryTags,
        image: form.image
      });

      navigate('/app/donor/donations');
    } catch {
      // Toast handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/app/donor/donations" className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-forest-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings Inventory</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Food Item Details */}
        <Card className="border-ivory-300 p-6 space-y-5">
          <div className="border-b border-ivory-200 pb-3">
            <h3 className="text-base font-serif font-bold text-charcoal-900">
              1. Food Description & Categorization
            </h3>
            <p className="text-xs text-charcoal-500">
              Accurately describe the surplus batch to help recipient organizations assess distribution feasibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Food Listing Title"
                placeholder="e.g. Prepared Roasted Chicken Trays & Quinoa"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                helper="Specific, descriptive name of the food batch."
              />
            </div>

            <Select
              label="Food Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="prepared">Prepared Meals (Hot / Chilled)</option>
              <option value="bakery">Bakery & Pastries</option>
              <option value="produce">Fresh Fruits & Vegetables</option>
              <option value="dairy">Dairy & Chilled Staples</option>
              <option value="packaged">Pantry / Shelf Stable Packaged Goods</option>
            </Select>

            <Select
              label="Allocation Workflow"
              value={form.workflowType}
              onChange={e => setForm({ ...form, workflowType: e.target.value })}
              required
            >
              <option value="request_approval">Review & Approve (Recommended for large batches)</option>
              <option value="instant_claim">Instant Auto-Allocation (First accredited NGO gets it)</option>
            </Select>

            <div className="md:col-span-2">
              <Textarea
                label="Detailed Description & Packaging Condition"
                placeholder="Detail the cooking or packaging time, how it is stored, and packaging format (e.g. foil hotel pans, plastic food crates)."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Quantities, Yield, & Timing */}
        <Card className="border-ivory-300 p-6 space-y-5">
          <div className="border-b border-ivory-200 pb-3">
            <h3 className="text-base font-serif font-bold text-charcoal-900">
              2. Quantity, Servings & Pickup Deadline
            </h3>
            <p className="text-xs text-charcoal-500">
              Set clear time windows to prevent safe surplus food from expiring before collection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Available Quantity"
              type="number"
              min="1"
              placeholder="e.g. 50"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              required
            />

            <Select
              label="Measurement Unit"
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
              required
            >
              <option value="portions">Individual Portions</option>
              <option value="hotel pans">Full Hotel Pans / Trays</option>
              <option value="loaves">Loaves / Bakery Units</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="crates">Crates / Boxes</option>
              <option value="units">Retail Units / Cartons</option>
            </Select>

            <Input
              label="Estimated Servings (Meals)"
              type="number"
              min="1"
              placeholder="e.g. 50"
              value={form.estimatedServings}
              onChange={e => setForm({ ...form, estimatedServings: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Pickup Expiration Window"
              value={form.pickupDeadlineHours}
              onChange={e => setForm({ ...form, pickupDeadlineHours: e.target.value })}
              required
            >
              <option value="3">Within 3 Hours (Urgent Hot Food)</option>
              <option value="6">Within 6 Hours (Today Afternoon/Evening)</option>
              <option value="12">Within 12 Hours (Tonight)</option>
              <option value="24">Within 24 Hours (Tomorrow Morning)</option>
              <option value="48">Within 48 Hours (Shelf Stable / Produce)</option>
            </Select>

            <Input
              label="Collection Pickup Address & Bay"
              value={form.pickupAddress}
              onChange={e => setForm({ ...form, pickupAddress: e.target.value })}
              required
            />
          </div>
        </Card>

        {/* Section 3: Storage, Safety & Allergens */}
        <Card className="border-ivory-300 p-6 space-y-5">
          <div className="border-b border-ivory-200 pb-3">
            <h3 className="text-base font-serif font-bold text-charcoal-900">
              3. Food Safety, Storage & Allergens
            </h3>
            <p className="text-xs text-charcoal-500">
              Crucial for recipient shelters to ensure guest safety and cold-chain compliance.
            </p>
          </div>

          <Textarea
            label="Storage Instructions & Handling Requirements"
            value={form.storageInstructions}
            onChange={e => setForm({ ...form, storageInstructions: e.target.value })}
            required
            rows={2}
          />

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-2">
              Declared Allergens Present in Food
            </label>
            <div className="flex flex-wrap gap-2">
              {commonAllergens.map(al => {
                const selected = form.allergens.includes(al);
                return (
                  <button
                    key={al}
                    type="button"
                    onClick={() => toggleAllergen(al)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      selected
                        ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                        : 'bg-ivory-100 text-charcoal-600 border-ivory-300 hover:bg-ivory-200'
                    }`}
                  >
                    {selected ? `✓ ${al}` : al}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-2">
              Dietary Certifications & Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {commonDietaryTags.map(dt => {
                const selected = form.dietaryTags.includes(dt);
                return (
                  <button
                    key={dt}
                    type="button"
                    onClick={() => toggleDietary(dt)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      selected
                        ? 'bg-forest-100 text-forest-800 border-forest-300 font-bold'
                        : 'bg-ivory-100 text-charcoal-600 border-ivory-300 hover:bg-ivory-200'
                    }`}
                  >
                    {selected ? `✓ ${dt}` : dt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Preset Selector */}
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-2">
              Select Batch Photo Preview
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {sampleImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setForm({ ...form, image: img.url })}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
                    form.image === img.url ? 'border-forest-700 ring-2 ring-forest-200' : 'border-ivory-300 hover:border-charcoal-400'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-16 object-cover rounded-lg" />
                  <span className="text-[10px] font-semibold text-charcoal-800 block text-center mt-1 truncate">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link to="/app/donor/donations">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button
            type="submit"
            variant="terracotta"
            size="lg"
            loading={loading}
            icon={CheckCircle2}
          >
            Publish Surplus Donation Listing
          </Button>
        </div>
      </form>
    </div>
  );
}
