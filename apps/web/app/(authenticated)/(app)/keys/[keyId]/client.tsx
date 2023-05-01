"use client";
import { PageHeader } from "@/components/page-header";
import { Policy } from "@/lib/policies";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DeleteKeyButton } from "../delete-key";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const allActions = ["create", "read", "update", "delete", "ingest"];

type Props = {
  apiKey: {
    id: string;
    name: string;
    firstCharacters: string | null;
    createdAt: Date;
    policy: string | null;
  };
  channelIdToName: Record<string, string>;
};
export const Client: React.FC<Props> = ({ apiKey, channelIdToName }) => {
  const { toast } = useToast();

  const policy = apiKey.policy ? Policy.parse(apiKey.policy) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
      <PageHeader
        title={apiKey.name}
        description={`created at ${apiKey.createdAt.toLocaleString()}`}
        actions={[
          <Badge key="key">{apiKey.firstCharacters ?? undefined}...</Badge>,
          <DeleteKeyButton key="delte" keyId={apiKey.id}>
            <Button variant="subtle">
              <Trash className="w-4 h-4 mr-2" />
              <span>Revoke</span>
            </Button>
          </DeleteKeyButton>,
        ]}
      />
      <div className="space-y-10 divide-y divide-zinc-900/10 mt-8">
        {policy?.statements.map((statement, _i) => {
          return Object.entries(statement.resources).map(([_resourceType, resources]) => (
            <div className="flex flex-col md:flex-row ">
              {/* <div className="w-full md:w-1/5">
    This is here in preparateion for the future where we'll have more than just channels
                                <CardHeader>
                                    <CardTitle>{resourceType}</CardTitle>
                                </CardHeader>

                            </div> */}
              <Card className="w-full ">
                <CardContent>
                  {Object.entries(resources ?? {}).map(([grid, permissions]) => {
                    return (
                      <div className=" py-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between w-full">
                        <span className="text-sm font-medium leading-6 text-white">
                          {channelIdToName[grid.split("::").at(-1) ?? ""]}
                        </span>
                        <div className="text-sm text-zinc-400 flex flex-wrap items-center justify-right gap-4">
                          {allActions.map((action) => (
                            <div key={action} className="flex items-center space-x-2">
                              <Checkbox
                                checked={permissions.includes(action)}
                                onClick={() => {
                                  toast({
                                    title: "You can't update permissions yet",
                                    description: "Coming soon...",
                                  });
                                }}
                              />

                              <Label>{action}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ));
        })}
      </div>
    </div>
  );
};
