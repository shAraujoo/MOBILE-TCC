import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginStyles as styles } from "../styles/loginstyles";

export default function LoginScreen() {
  const router = useRouter(); // Expo Router
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Por favor, preencha todos os campos.");

    try {
      const res = await fetch("https://tcc-back-2025.vercel.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert("Login bem-sucedido!");
        router.push("/src/profile"); // Expo Router
      } else {
        Alert.alert(data.message || "Usuário ou senha inválidos.");
      }
    } catch {
      Alert.alert("Erro na conexão com o servidor.");
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword)
      return Alert.alert("Por favor, preencha todos os campos.");
    if (password !== confirmPassword)
      return Alert.alert("As senhas não coincidem.");
    if (password.length < 6)
      return Alert.alert("A senha deve ter pelo menos 6 caracteres.");

    try {
      const res = await fetch("https://tcc-back-2025.vercel.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: name, email, senha: password }),
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert("Cadastro realizado com sucesso!");
        setIsRegistering(false);
      } else {
        Alert.alert(data.message || "Erro ao criar conta.");
      }
    } catch {
      Alert.alert("Erro na conexão com o servidor.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <LinearGradient
          colors={["#c6ad8f", "#22333b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        />

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Palavraria</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{isRegistering ? "Criar Conta" : "Bem-vindo(a)"}</Text>
          <Text style={styles.subtitle}>
            {isRegistering ? "Preencha os dados para se cadastrar" : "Faça login para continuar"}
          </Text>
        </View>

        {isRegistering && (
          <TextInput
            placeholder="Nome completo"
            placeholderTextColor="#999"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {isRegistering && (
          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={isRegistering ? handleRegister : handleLogin}>
          <Text style={styles.buttonText}>{isRegistering ? "Criar Conta" : "Entrar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.linkText}>
            {isRegistering ? "Já tem uma conta? Fazer login" : "Não tem uma conta? Cadastre-se"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
