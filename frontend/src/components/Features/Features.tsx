import { cn } from "../../lib/utils";
import {
  IconBrain,
  IconFileText,
  IconCurrencyDollar,
  IconSearch,
  IconRocket,
  IconBolt,
  IconLayoutGrid,
  IconHistory,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "AI-Powered Resume Matching",
      description:
        "Nexume.ai analyzes job descriptions and aligns your resume with the exact skills and keywords recruiters want.",
      icon: <IconBrain />,
    },
    {
      title: "ATS-Friendly Templates",
      description:
        "Generate resumes designed to pass through Applicant Tracking Systems with smart formatting and clean layouts.",
      icon: <IconFileText />,
    },
    {
      title: "Job Description Insights",
      description:
        "Get instant analysis of job posts — highlighting skills, qualifications, and how well your resume matches.",
      icon: <IconSearch />,
    },
    {
      title: "One-Click Resume Optimization",
      description:
        "Upload your resume and job post — Nexume.ai does the rest. Save hours and get better results.",
      icon: <IconRocket />,
    },
    {
      title: "Skill & Keyword Boosting",
      description:
        "Automatically enhance your resume with the right buzzwords, metrics, and impact-driven phrases.",
      icon: <IconBolt />,
    },
    {
      title: "Multiple Template Options",
      description:
        "Choose from sleek, ATS-compliant templates tailored to your industry and role.",
      icon: <IconLayoutGrid />,
    },
    {
      title: "Version History & Downloads",
      description:
        "Keep track of different resume versions and download anytime — PDF, DOCX, and more.",
      icon: <IconHistory />,
    },
    {
      title: "No-Fluff, Pay-As-You-Go",
      description:
        "Transparent pricing, no hidden fees, and no commitment. Try it, love it, or leave it.",
      icon: <IconCurrencyDollar />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800",
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-indigo-600 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
