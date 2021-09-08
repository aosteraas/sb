import React, { useState } from 'react';
import {
  Text,
  Code,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { Hero } from '../components/Hero';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { genSid, getDefaultHeaders } from '../lib/requests';

export enum Privilege {
  USER = 'usr',
  INSTALLER = 'istl',
}

const Index = () => {
  const [ip, setIp] = useState('');
  const [password, setPassword] = useState('');
  const [lsid, setLsid] = useState(genSid());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ssid, setSsid] = useState('');
  const [loginMeta, setLoginMeta] = useState<any>();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMeta(undefined);
    try {
      const params = { right: Privilege.USER, pass: password };
      const url = `http://${ip}/dyn/login.json`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { ...getDefaultHeaders(lsid) },
        body: JSON.stringify(params),
      });

      const data = (await res.json()) as { sid: string };

      setSsid(data.sid);

      const meta = {
        statusCode: res.status,
        ssid,
        body: data,
        headers: Array.from(res.headers.entries()),
      };
      setLoginMeta(meta);
      // what to do with cookies?
      // setCookie(res.headers.cookie);
      setIsLoggedIn(res.ok);
    } catch (err) {
      setLoginMeta(err);
    }
  };

  return (
    <Container height="100vh">
      <Hero title="sunny-boi" />
      <Main>
        <form onSubmit={onSubmit}>
          <FormControl isRequired id="ip">
            <FormLabel>IP</FormLabel>
            <Input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl pt="1rem">
            <Button colorScheme="blue" type="submit">
              Login
            </Button>
          </FormControl>
        </form>
        <Code>Logged in: {isLoggedIn ? 'true' : 'false'} </Code>
        <Code>{JSON.stringify(loginMeta ?? {}, null, 2)}</Code>
      </Main>

      <DarkModeSwitch />
    </Container>
  );
};

export default Index;
