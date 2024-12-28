import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";

const features = [
  {
    name: "Store your PDF document",
    description: "Store your PDF document in the cloud",
    icon: GlobeIcon,
  },
  {
    name: "Blazing fast responses",
    description: "Fast responses for your PDF document",
    icon: ZapIcon,
  },
  {
    name: "Chat Memorisation",
    description: "Chat Memorisation for your PDF document",
    icon: BrainCogIcon,
  },
  {
    name: "Interactive PDF viewer",
    description: "Interactive PDF viewer for your PDF document",
    icon: EyeIcon,
  },
  {
    name: "Cloud backup",
    description: "Cloud backup for your PDF document",
    icon: ServerCogIcon,
  },
  {
    name: "Responsive Across Devices",
    description: "Responsive Across Devices for your PDF document",
    icon: MonitorSmartphoneIcon,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-auto p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow">
        <div className="flex flex-col justify-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Youre Interactive Document Companion
            </h2>

            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your PDFs into Interactive Conversations
            </p>

            <p className="mt-6 text-lg text-gray-600">
              Introducing{""}
              <span className="font-bold text-indigo-600"> Chat with PDF</span>
              <br />
              <br />
              Upload Your document, and our chatbot will answer questions,
              summarize content, and answer all your Qs. Ideal for everyone,{" "}
              <span className="text-indigo-600">Chat with PDF</span> turns
              static documents int{" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold efforltessly.
            </p>
          </div>

          <Button asChild className="mt-10">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              alt="App screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]"></div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:st-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div className="relative pl-9" key={feature.name}>
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon
                    className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                    aria-hidden="true"
                  />
                </dt>

                <dd>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
