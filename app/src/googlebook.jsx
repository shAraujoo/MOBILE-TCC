import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../styles/theme";


export default function GoogleBookScreen() {
  const router = useRouter(); // <--- CRIA O ROUTER AQUI

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [addModal, setAddModal] = useState(false);
  const [paginasInput, setPaginasInput] = useState("");
  const [obsInput, setObsInput] = useState("");

  const searchBooks = async () => {
    const q = query.trim();
    if (!q) {
      Alert.alert("Digite algo para buscar");
      return;
    }
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          q
        )}&maxResults=20`
      );
      const data = await res.json();
      setResults(data.items || []);
    } catch (e) {
      Alert.alert("Erro na busca", "Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (book) => setSelectedBook(book);

  const addToBackend = async (book, paginas, obs) => {
    const vi = book.volumeInfo || {};
    const isbn =
      vi.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier ||
      vi.industryIdentifiers?.[0]?.identifier ||
      null;

    const livroData = {
      titulo: vi.title || "Sem título",
      autor: (vi.authors || []).join(", ") || "Autor desconhecido",
      isbn: isbn || `SEMISBN-${Date.now()}`,
      editora: vi.publisher || "Editora desconhecida",
      anoPublicacao: parseInt((vi.publishedDate || "").substring(0, 4)) || 0,
      genero: (vi.categories || []).join(", "),
      sinopse: vi.description || "",
      paginas: paginas ? parseInt(paginas) : vi.pageCount || 0,
      observacoes: obs || "",
      idioma: vi.language || "desconhecido",
    };

    try {
      const res = await fetch("https://tcc-back-2025.vercel.app/livros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livroData),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.titulo) {
        Alert.alert("Sucesso", `Livro "${data.titulo}" adicionado`);
      } else {
        Alert.alert("Aviso", data?.mensagem || data?.erro || "Erro desconhecido");
      }
    } catch {
      Alert.alert("Falha", "Não foi possível conectar ao servidor.");
    }
  };

  const renderCard = ({ item }) => {
    const vi = item.volumeInfo || {};
    const thumb =
      vi.imageLinks?.thumbnail?.replace("http://", "https://") || null;

    return (
      <TouchableOpacity style={styles.card} onPress={() => openDetails(item)}>
        <View style={styles.thumbWrap}>
          {thumb ? (
            <Image source={{ uri: thumb }} style={styles.thumb} />
          ) : (
            <View style={styles.noImage}>
              <FontAwesome name="book" size={26} color={theme.textSec} />
            </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {vi.title || "Sem título"}
          </Text>

          <Text numberOfLines={1} style={styles.cardAuthors}>
            {(vi.authors || []).join(", ") || "Autor desconhecido"}
          </Text>

          {vi.publishedDate ? (
            <Text style={styles.cardDate}>{vi.publishedDate}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[theme.background, "#f6f4ef"]}
      style={styles.root}
    >
      <BlurView intensity={80} tint="light" style={styles.header}>
        <Text style={styles.logoText}>Palavraria</Text>

        {/* BOTÃO QUE NAVEGA PARA /profile */}
        <TouchableOpacity
          style={styles.userBox}
          onPress={() => router.push("/src/profile")}
        >
          <Text style={styles.userName}>Usuário</Text>
        </TouchableOpacity>
      </BlurView>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Título, autor ou assunto"
            placeholderTextColor={theme.textSec}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchBooks}
            style={styles.input}
            returnKeyType="search"
          />

          <TouchableOpacity style={styles.searchBtn} onPress={searchBooks}>
            <FontAwesome name="search" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : results.length === 0 ? (
          <View style={styles.empty}>
            <FontAwesome name="search" size={42} color={theme.textSec} />
            <Text style={styles.emptyText}>
              Busque um livro pela API integrada
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            contentContainerStyle={styles.list}
          />
        )}
      </KeyboardAvoidingView>

      <Modal visible={!!selectedBook} animationType="fade">
        <ScrollView
          style={styles.modalRoot}
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setSelectedBook(null)}
          >
            <FontAwesome name="arrow-left" size={16} color="#fff" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          {selectedBook && (
            <>
              <Image
                source={{
                  uri:
                    selectedBook.volumeInfo.imageLinks?.thumbnail?.replace(
                      "http://",
                      "https://"
                    ) || null,
                }}
                style={styles.detailsThumb}
              />

              <Text style={styles.detailsTitle}>
                {selectedBook.volumeInfo.title}
              </Text>

              <Text style={styles.detailsAuthors}>
                {(selectedBook.volumeInfo.authors || []).join(", ")}
              </Text>

              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>
                {selectedBook.volumeInfo.description ||
                  "Nenhuma descrição disponível."}
              </Text>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setAddModal(true)}
              >
                <FontAwesome name="plus" size={16} color="#fff" />
                <Text style={styles.addBtnText}>Adicionar ao Banco</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Modal>

      <Modal visible={addModal} transparent animationType="fade">
        <View style={styles.addModalOverlay}>
          <View style={styles.addModalBox}>
            <Text style={styles.modalTitle}>Adicionar Livro</Text>

            <TextInput
              placeholder="Número de páginas"
              placeholderTextColor={theme.textSec}
              keyboardType="numeric"
              value={paginasInput}
              onChangeText={setPaginasInput}
              style={styles.modalInput}
            />

            <TextInput
              placeholder="Observações"
              placeholderTextColor={theme.textSec}
              multiline
              value={obsInput}
              onChangeText={setObsInput}
              style={[styles.modalInput, { height: 80 }]}
            />

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                addToBackend(selectedBook, paginasInput, obsInput);
                setAddModal(false);
              }}
            >
              <Text style={styles.confirmText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setAddModal(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 46,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  logoText: {
    fontSize: 22,
    color: theme.primary,
    fontWeight: "600",
  },

  userBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radiusSm,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  userName: {
    color: theme.text,
  },

  content: { flex: 1, padding: 16 },

  searchRow: { flexDirection: "row", marginBottom: 12 },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopLeftRadius: theme.radius,
    borderBottomLeftRadius: theme.radius,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },

  searchBtn: {
    backgroundColor: theme.primary,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: theme.radius,
    borderBottomRightRadius: theme.radius,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  empty: { flex: 1, alignItems: "center", marginTop: 40 },
  emptyText: { marginTop: 10, color: theme.textSec },

  list: { paddingTop: 8, paddingBottom: 20 },

  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 12,
    overflow: "hidden",
  },

  thumbWrap: { width: 100, height: 150 },
  thumb: { width: "100%", height: "100%" },

  noImage: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  cardInfo: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 16, color: theme.primary, fontWeight: "500" },
  cardAuthors: { marginTop: 6, color: theme.textSec },
  cardDate: { marginTop: 6, color: theme.textSec, fontSize: 12 },

  modalRoot: { flex: 1, backgroundColor: "#fff" },
  modalContent: { padding: 16, paddingBottom: 60 },

  backBtn: {
    flexDirection: "row",
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radiusSm,
    alignSelf: "flex-start",
  },
  backText: { color: "#fff", marginLeft: 8 },

  detailsThumb: {
    width: "100%",
    height: 300,
    borderRadius: theme.radius,
    marginTop: 14,
    backgroundColor: "#ddd",
  },

  detailsTitle: {
    fontSize: 22,
    marginTop: 12,
    color: theme.primary,
    fontWeight: "600",
  },

  detailsAuthors: {
    marginTop: 6,
    color: theme.secondary,
    fontSize: 16,
  },

  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
    color: theme.primary,
  },

  description: {
    marginTop: 8,
    color: theme.text,
    lineHeight: 20,
  },

  addBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: theme.radius,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  addBtnText: { color: "#fff", marginLeft: 8 },

  addModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  addModalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.border,
  },

  modalTitle: {
    fontSize: 18,
    color: theme.primary,
    marginBottom: 16,
  },

  modalInput: {
    backgroundColor: "#f4f4f4",
    borderRadius: theme.radiusSm,
    padding: 12,
    marginBottom: 12,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },

  confirmBtn: {
    backgroundColor: theme.primary,
    padding: 12,
    borderRadius: theme.radiusSm,
    alignItems: "center",
  },
  confirmText: { color: "#fff" },

  cancelBtn: {
    padding: 12,
    marginTop: 10,
    borderRadius: theme.radiusSm,
    alignItems: "center",
  },
  cancelText: { color: theme.text },
});
