'use client';

import { useEffect, useState } from "react";
import { getAdminRegistrationApplication } from "@/modules/adminRegistrationApplications/service";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface AdminRegistrationApplication {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}

const Page = ({ params }: { params: { slug: string; id: string } }) => {
  const [adminRegistrationApplicationDetails, setAdminRegistrationApplicationDetails] =
    useState<AdminRegistrationApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = () => {
      getAdminRegistrationApplication(params.id)
        .then((response) => {
          console.log(response.data)
          setAdminRegistrationApplicationDetails(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    };
    fetchDetails();
  }, [params.id]);

  return (
    <div className="form-container p-6 bg-white rounded-md shadow-md">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && adminRegistrationApplicationDetails && (
        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <Input
                id="first-name"
                value={adminRegistrationApplicationDetails.firstName}
                readOnly
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <Input
                id="last-name"
                value={adminRegistrationApplicationDetails.lastName}
                readOnly
                className="mt-1 block w-full"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email-address"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <Input
              id="email-address"
              type="email"
              value={adminRegistrationApplicationDetails.email}
              readOnly
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue>
                  {adminRegistrationApplicationDetails.country}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={adminRegistrationApplicationDetails.country}>
                  {adminRegistrationApplicationDetails.country}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="street-address"
              className="block text-sm font-medium text-gray-700"
            >
              Street address
            </label>
            <Input
              id="street-address"
              value={adminRegistrationApplicationDetails.streetAddress}
              readOnly
              className="mt-1 block w-full"
            />
          </div>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <Input
                id="city"
                value={adminRegistrationApplicationDetails.city}
                readOnly
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State / Province
              </label>
              <Input
                id="state"
                value={adminRegistrationApplicationDetails.state}
                readOnly
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP / Postal code
              </label>
              <Input
                id="zip"
                value={adminRegistrationApplicationDetails.zip}
                readOnly
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Page;
