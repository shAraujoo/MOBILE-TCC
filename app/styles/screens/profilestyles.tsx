import { View, Text, Image, TouchableOpacity } from "react-native"
import { profileStyles as s } from "../profilestyles"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function ProfileScreen() {
  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.logoText}>Palavraria - Seu Perfil</Text>
      </View>

      <View style={s.container}>
        <View style={s.contentHeader}>
          <Text style={s.contentHeaderTitle}>Meu Perfil de Leitura</Text>
          <Text style={s.contentHeaderText}>
            Acompanhe seu progresso de leitura e gerencie sua biblioteca pessoal
          </Text>
        </View>

        <View style={s.profileInfo}>
          <Image source={require("../../../assets/images/user.png")} style={s.profilePhoto} />
          <View style={s.userDetails}>
            <Text style={s.userName}>@usuario</Text>
            <Text>Membro desde Março 2025</Text>
          </View>
        </View>

        <TouchableOpacity style={s.addFavoriteBtn}>
          <Text style={s.addFavoriteText}>Adicionar favoritos</Text>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <Text style={s.footerText}>© 2025 Palavraria. Todos os direitos reservados.</Text>
      </View>
    </View>
  )
}
