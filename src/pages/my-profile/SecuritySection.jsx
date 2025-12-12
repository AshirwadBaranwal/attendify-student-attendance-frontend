import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ShieldCheck } from "lucide-react";
import ChangePasswordModal from "./modals/ChangePasswordModal";

const SecuritySection = () => {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck size={20} /> Security Settings
        </CardTitle>
        <CardDescription>
          Manage your account's security settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Password</h3>
            <p className="text-sm text-muted-foreground">
              Change your password regularly to keep your account secure.
            </p>
          </div>
          <ChangePasswordModal>
            <Button>Change Password</Button>
          </ChangePasswordModal>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySection;
