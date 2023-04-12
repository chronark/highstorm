import Link from "next/link";

type Props = {
  Tag: React.ComponentType<{ className: string }>;
  title: string;
  description: string;
  features: {
    name: string;
    description: string;
    href?: string;
    icon: React.ComponentType<{ className: string }>;
  }[];
};

export const FeatureSection: React.FC<Props> = ({ features, title, description, Tag }) => {
  return (
    <div className="py-24 sm:py-32">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="flex flex-col items-center max-w-2xl mx-auto lg:text-center">
          <div className="p-8 duration-500 border border-yellow-300 rounded-lg bg-yellow-300/5 hover:bg-yellow-300/20">
            <Tag className="w-8 h-8 text-yellow-300 shadow " />
          </div>

          <p className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</p>
          <p className="mt-6 leading-8 text-neutral-300">{description}</p>
        </div>
        <div className="max-w-2xl mx-auto mt-16 sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center text-base font-semibold leading-7 text-white gap-x-3">
                  <feature.icon className="flex-none w-5 h-5 text-yellow-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="flex flex-col flex-auto mt-4 text-base leading-7 text-neutral-300">
                  <p className="flex-auto">{feature.description}</p>
                  {feature.href ? (
                    <p className="mt-6">
                      <Link
                        href={feature.href}
                        className="text-sm font-semibold leading-6 text-yellow-400"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
