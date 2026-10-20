"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Dashboard from "@/components/admin/Dashboard";

import HeroEditor from "@/components/admin/HeroEditor";
import AboutUsEditor from "@/components/admin/AboutUsEditor";
import ServicesOverviewEditor from "@/components/admin/ServicesOverviewEditor";
import StartupsEditor from "@/components/admin/StartupsEditor";
import ProductsEditor from "@/components/admin/ProductsEditor";
import ContactCTAEditor from "@/components/admin/ContactCTAEditor";
import CustomerEditor from "@/components/admin/CustomersEditor";
import HowItWorksEditor from "@/components/admin/HowItWorksEditor";
import TechnologyPartnersEditor from "@/components/admin/TechnologyPartnersEditor";
import HighlightsEditor from "@/components/admin/HighlightsEditor";
import ClientsMarqueeEditor from "@/components/admin/ClientsMarqueeEditor";
import NewsInsightsEditor from "@/components/admin/NewsInsightsEditor";
import VerticalsOverviewEditor from "@/components/admin/VerticalsOverviewEditor";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";
import type { HomeContent } from "@/types/cms";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const [content, setContent] =
    useState<HomeContent | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data =
          await apiFetch<HomeContent>(
            "/content/home"
          );

        setContent(data);
      } catch (error) {
        console.error(
          "Failed to load admin content:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc]">
        <p className="text-gray-500">
          Loading admin panel...
        </p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc]">
        <p className="text-red-500">
          Failed to load content.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <AdminSidebar />

      <AdminHeader />

      <main className="ml-[260px] pt-[72px]">
        <div className="p-8">

          {/* Dashboard */}
          {!section && <Dashboard />}

          {/* Hero */}
          {section === "hero" && (
            <HeroEditor
              slides={content.heroSlides}
              onUpdated={(slides) =>
                setContent({
                  ...content,
                  heroSlides: slides,
                })
              }
            />
          )}

          {/* About Us */}
          {section === "about" && (
            <AboutUsEditor
              content={content.aboutUs}
              onUpdated={(aboutUs) =>
                setContent({
                  ...content,
                  aboutUs,
                })
              }
            />
          )}

          {/* Services Overview */}
          {section === "services" && (
            <ServicesOverviewEditor
              content={content.servicesOverview}
              onUpdated={(servicesOverview) =>
                setContent({
                  ...content,
                  servicesOverview,
                })
              }
            />
          )}

          {section === "startups" && (
            <StartupsEditor
              content={content.startups}
              startupsSection={
                content.startupsSection
              }
              onUpdated={(startups) =>
                setContent((previous) => {
                  if (!previous) {
                    return previous;
                  }

                  return {
                    ...previous,
                    startups,
                  };
                })
              }
              onSectionUpdated={(
                startupsSection
              ) =>
                setContent((previous) => {
                  if (!previous) {
                    return previous;
                  }

                  return {
                    ...previous,
                    startupsSection,
                  };
                })
              }
            />
          )}

{/* Products */}
{section === "products" && (
  <ProductsEditor
    content={content.products}
    onUpdated={(products) =>
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          products,
        };
      })
    }
  />
)}

{/* Contact CTA */}
{section === "ctaContent" && (
  <ContactCTAEditor
    content={content.contactCTA}
    onUpdated={(contactCTA) =>
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          contactCTA,
        };
      })
    }
  />
)}




{/* Customers */}
{section === "customers" && (
  <CustomerEditor
    content={content.customers}
    onUpdated={(customers) => {
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          customers,
        };
      });
    }}
  />
)}

{/* How It Works */}
{section === "howitworks" && (
  <HowItWorksEditor
    content={content.howItWorks}
    onUpdated={(howItWorks) => {
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          howItWorks,
        };
      });
    }}
  />
)}


{section === "technologyPartners" && (
  <TechnologyPartnersEditor
    content={content.technologyPartners}
    onUpdated={(technologyPartners) => {
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          technologyPartners,
        };
      });
    }}
  />
)}

{/* Highlights */}
{section === "highlights" && (
  <HighlightsEditor
    content={content.highlights}
    onUpdated={(highlights) => {
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          highlights,
        };
      });
    }}
  />
)}

{/* Clients Marquee */}
{section === "clients" && (
  <ClientsMarqueeEditor
    content={content.clientsMarquee}
    onUpdated={(clientsMarquee) => {
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          clientsMarquee,
        };
      });
    }}
  />
)}

{/* News & Insights */}
{section === "news" && (
  <NewsInsightsEditor
    content={content.newsInsights}
    onUpdated={(newsInsights) => {
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          newsInsights,
        };
      });
    }}
  />
)}

{/* Verticals Overview */}
{section === "verticals" && (
  <VerticalsOverviewEditor
    content={content.verticalsOverview}
    onUpdated={(verticalsOverview) => {
      setContent((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          verticalsOverview,
        };
      });
    }}
  />
)}
<Footer />
        </div>
      </main>
    </div>
  );
}