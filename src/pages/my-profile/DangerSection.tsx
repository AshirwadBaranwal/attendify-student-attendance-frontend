import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import DeleteAccountModal from "./modals/DeleteAccount";

const DangerZone = () => {
  return (
    <Card className="border-destructive rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle size={20} /> Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
          <h3 className="font-bold text-destructive">Delete This Account</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <DeleteAccountModal>
            <Button variant="destructive">
              Delete Account and All College Data
            </Button>
          </DeleteAccountModal>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
