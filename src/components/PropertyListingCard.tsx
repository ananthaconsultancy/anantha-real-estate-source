import React from "react";
import { ArrowRight, BadgeCheck, CalendarCheck, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import type { Property } from "@/data/properties";
import { propertyFallbackImage } from "@/data/stockImages";

const formatStatus = (status: Property["status"]) =>
  status.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (date?: string) => {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const PropertyListingCard: React.FC<{ property: Property }> = ({ property }) => {
  const verificationDate = formatDate(property.lastVerifiedAt);
  const image = property.image || propertyFallbackImage(property.type);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300">
      <div className="relative aspect-[16/9] bg-gradient-to-br from-[#17105e] to-[#2387ef] overflow-hidden">
        <img
          src={image}
          alt={property.imageAlt || `${property.name} in ${property.location}`}
          className="h-full w-full object-cover transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#15133e]/82 to-transparent">
          <div className="flex w-full items-center justify-between gap-3">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-[#2f227f]">
              {formatStatus(property.status)}
            </span>
            {property.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#2f227f]">
                <BadgeCheck size={14} className="text-[#2387ef]" /> Verified by ARE
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={15} className="text-[#4b2cab]" /> {property.location}, {property.city}
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight mt-3 text-slate-950">{property.name}</h2>
        <p className="text-slate-500 mt-2 line-clamp-2">{property.shortDescription}</p>

        <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
          {property.area && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="block text-slate-500">Area</span>
              <span className="font-semibold inline-flex items-center gap-1 mt-1 text-[#28235e]">
                <Ruler size={14} /> {property.area}
              </span>
            </div>
          )}
          {property.priceLabel && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="block text-slate-500">Price</span>
              <span className="font-semibold mt-1 block text-[#28235e]">{property.priceLabel}</span>
            </div>
          )}
        </div>

        {property.projectName && (
          <p className="text-sm text-slate-500 mt-4">
            Project: <span className="font-medium text-[#28235e]">{property.projectName}</span>
          </p>
        )}

        {verificationDate && (
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500">
            <CalendarCheck size={14} /> Verified by ARE · {verificationDate}
          </p>
        )}

        <Link to={`/property/${property.slug}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-[#4324a5] hover:text-[#2387ef] transition-colors">
          View property <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
};

export default PropertyListingCard;
