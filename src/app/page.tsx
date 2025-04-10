"use client";
import { Button, View, Heading, Flex, Text } from "@aws-amplify/ui-react";
import Chat from "@/components/Chat";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Analytics } from "../../amplify/functions/analytics/analytics";
import { useEffect } from 'react';

export default function Home() {
  const { user, signOut } = useAuthenticator();
  const userId = user?.signInDetails?.loginId;

  // Track sign out events
  const handleSignOut = async () => {
    await Analytics.trackAuthEvent('SIGN_OUT', userId);
    signOut();
  };

  // Track page load
  useEffect(() => {
    Analytics.trackPageView('home', userId);
  }, [userId]);

  return (
    <View className="app-container">
      <Flex
        as="header"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem"
      >
        <Text fontWeight="bold">{"Welcome, " + userId}</Text>
        <Heading level={3}>HR Personal Assistant</Heading>
        <Button 
          onClick={handleSignOut} 
          size="small" 
          variation="destructive"
        >
          Sign out
        </Button>
      </Flex>
      <View as="main">
        <Chat />
      </View>
    </View>
  );
}
