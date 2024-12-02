import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import Login from "@/components/Login";
import db from "@/database/db";
import Loading from "@/components/Loading";

export default function Index() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    db.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else if (session) {
    return <Redirect href="tabs/home" />;
  } else {
    return <Login />;
  }
}
