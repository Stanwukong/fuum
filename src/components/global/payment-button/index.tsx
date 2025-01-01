import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { useSubscription } from "@/hooks/useSubscription";


const PaymentButton = () => {
  const { onSubscribe, isProcessing } = useSubscription();
  return (
    <Button
      onClick={onSubscribe}
      disabled={isProcessing}
      className="text-sm w-full"
    >
      <Loader color="#000" state={isProcessing}>
        Upgrade
      </Loader>
    </Button>
  );
};

export default PaymentButton;
