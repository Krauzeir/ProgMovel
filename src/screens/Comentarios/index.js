import React from 'react';
import { FlatList, Text, Modal, TextInput, Alert } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/AntDesign";
import Swipeable from "react-native-swipeable-row";
import SyncStorage from 'sync-storage';
import Moment from 'react-moment';

import "moment-timezone"

import { 
    Avatar,     
    Cabecalho,     
    CentralizadoNaMesmaLinha, 
    NomeProduto,

    AutorComentario,
    ContenedorComentarios,
    ContenedorComentarioDoUsuario,
    ContenedorComentarioDeOutroUsuario,
    Comentario,
    EspacadorComentario, 
    DataComentario, 
    DivisorComentario,
    ContenedorNovoComentario,
    Espacador
} from '../../assets/styles';
import comentariosEstaticos from "../../assets/dicionarios/comentarios.json";
import avatar from "../../assets/imgs/avatar.png";
import { View } from 'react-native';

const COMENTARIOS_POR_PAGINA = 5;
const TAMANHO_MAXIMO_COMENTARIO = 100;

export default class Comentarios extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feedId: this.props.navigation.state.params.feedId,
            produto: this.props.navigation.state.params.produto,
            empresa: this.props.navigation.state.params.empresa,
            
            comentarios: [],
            proximaPagina: 0,
            textoNovoComentario: "",

            carregando: false,
            atualizando: false,
            telaAdicaoVisivel: false
        }
    }

    carregarComentarios = () => {
        const { feedId, comentarios, proximaPagina } = this.state;

        this.setState({
            carregando: true
        });

        // carregar o total de comentarios por pagina da pagina atual
        // tambem tem que filtrar pelo feed selecionado na tela anterior
        const idInicial = proximaPagina * COMENTARIOS_POR_PAGINA + 1;
        const idFinal = idInicial + COMENTARIOS_POR_PAGINA - 1;

        const maisComentarios = comentariosEstaticos.comentarios.filter(
            (comentario) => comentario._id >= idInicial &&
            comentario._id <= idFinal && comentario.feed === feedId);

            if (maisComentarios.length) {
            this.setState({
                proximaPagina: proximaPagina + 1,
                comentarios: [...comentarios, ...maisComentarios],

                atualizando: false,
                carregando: false
            });
        } else {
            this.setState({
                atualizando: false,
                carregando: false
            })
        }
    }

    componentDidMount = () => {
        this.carregarComentarios();
    }

    carregarMaisComentarios = () => {
        const { carregando } = this.state;
        if (carregando) {
            return;
        }

        this.carregarComentarios();
    }

    removerComentario = (comentarioParaRemover) => {
        const { comentarios } = this.state;

        const comentariosFiltrados = comentarios.filter((comentario) => {
            comentario._id !== comentarioParaRemover._id
        });

        this.setState({
            comentarios: comentariosFiltrados
        }, () => {
            this.atualizar()
        });
    }

    confirmarRemocao = (comentario) => {
        Alert.alert(
            null,
            "Remover o seu comentário?",
            [
                { text: "NÃO", style: 'cancel' },
                { text: "SIM", onPress: () => this.removerComentario(comentario)}
            ]
        )
    }

    mostrarComentarioDoUsuario = (comentario) => {
        return(
            <>
                <Swipeable
                    rightButtonWidth={50}
                    rightButtons={[
                        <View style={{ padding: 13 }}>
                            <Espacador />
                            <Icon name="delete" color="#030303" size={28}
                                onPress={() => {
                                    this.confirmarRemocao(comentario);
                                }}/>
                        </View>
                        ]
                    }>
                    <ContenedorComentarioDoUsuario>
                        <AutorComentario>{ "Você:"}</AutorComentario>
                        <Comentario>{ comentario.content }</Comentario>
                        <DataComentario>
                            <Moment element={Text} parse="YYYY-MM-DD HH:mm"
                                format="DD/MM/YYYY HH:mm">
                                { comentario.datetime }
                            </Moment>
                        </DataComentario>
                    </ContenedorComentarioDoUsuario>
                </Swipeable>
                <EspacadorComentario />
            </>
        );
    }

    mostrarComentarioDeOutroUsuario = (comentario) => {
        return (
            <>
                <ContenedorComentarioDeOutroUsuario>
                    <AutorComentario>{ comentario.user.name }</AutorComentario>
                    <Comentario>{ comentario.content } </Comentario>
                    <DataComentario>
                        <Moment element={Text} parse="YYYY-MM-DD HH:mm"
                            format="DD/MM/YYYY HH:mm">
                            { comentario.datetime }
                        </Moment>
                    </DataComentario>
                </ContenedorComentarioDeOutroUsuario>
                <EspacadorComentario />
            </>
        );
    }

    atualizar = () => {
        this.setState({ atualizando: true, carregando: false, proximaPagina: 0,
            comentarios: [] }, () => {
                this.carregarComentarios();
            });
    }

    adicionarComentario = () => {
        const { feedId, comentarios, textoNovoComentario } = this.state;
        const usuario = SyncStorage.get("user");

        const comentario = [
            {
                "_id": comentarios.length + 100,
                "feed": feedId,
                "user": {
                    "userId": 2,
                    "email": usuario.email,
                    "name": usuario.name
                },
                "datetime": "2020-03-26T12:00-0500",
                "content": textoNovoComentario
            }
        ];

        this.setState({
            comentarios: [...comentario, ...comentarios]
        });

        this.mudarVisibilidadeTelaAdicao();
    }

    mudarVisibilidadeTelaAdicao = () => {
        const { telaAdicaoVisivel } = this.state;

        this.setState({ telaAdicaoVisivel : !telaAdicaoVisivel });
    }

    atualizarTextoNovoComentario = (texto) => {
        this.setState({
            textoNovoComentario: texto
        });
    }

    mostrarTelaAdicaoComentario = () => {
        return(
            <Modal
                animationType="slide"
                transparent={true}

                onRequestClose={
                    () => {
                        this.atualizar();
                    }
                }
            >
                <ContenedorNovoComentario>
                    <TextInput 
                        multiline={true}
                        numberOfLines={3}

                        editable={true}

                        placeholder={"Digite um comentário"}
                        maxLength={TAMANHO_MAXIMO_COMENTARIO}

                        onChangeText={ (texto) => {
                            this.atualizarTextoNovoComentario(texto);
                        }}
                    />
                    <DivisorComentario />
                    <Espacador />
                    <CentralizadoNaMesmaLinha>
                        <Button
                            icon={
                                <Icon name="check"
                                    size={22}
                                    color="#fff"/>
                            }

                            title="Gravar"
                            type="solid"

                            onPress={
                                () => {
                                    this.adicionarComentario();
                                }
                            }
                        />
                        <Espacador />
                        <Button 
                            icon={
                                <Icon name="closecircle"
                                    size={22}
                                    color="#fff"/>
                            }

                            title= "Cancelar"
                            type="solid"

                            onPress={
                                () => {
                                    this.mudarVisibilidadeTelaAdicao();
                                }
                            }
                        />
                    </CentralizadoNaMesmaLinha>
                    <Espacador />
                </ContenedorNovoComentario>
            </Modal>
        );
    }

    mostrarComentarios = () => {
        const { produto, comentarios, atualizando } = this.state;
        const usuario = SyncStorage.get("user");

        return(
            <>
                <Header 
                    leftComponent={
                        <Icon name="left" size={28} onPress={() => {
                                this.props.navigation.goBack()
                            }
                        } />
                    }

                    centerComponent={
                        <CentralizadoNaMesmaLinha>
                            <Avatar source={avatar} />
                            <NomeProduto> {produto.name}</NomeProduto>
                        </CentralizadoNaMesmaLinha>
                    }

                    rightComponent={
                        <Icon name="pluscircleo" size={28} onPress={
                            () => {
                                this.mudarVisibilidadeTelaAdicao();
                            }
                        } />
                    }

                    containerStyle={ Cabecalho }
                />
                <ContenedorComentarios>
                    <FlatList
                        data = {comentarios}

                        onEndReached = { () => {this.carregarMaisComentarios();} }
                        onEndReachedThreshold = { 0.1 }

                        onRefresh = { () => {this.atualizar();} }
                        refreshing = { atualizando }

                        keyExtractor = { (item) => String(item._id) }
                        renderItem = { ({item}) => {
                                if (item.user.email == usuario.email) {
                                    return this.mostrarComentarioDoUsuario(item)
                                } else {
                                    return this.mostrarComentarioDeOutroUsuario(item)
                                }
                            }
                        }
                    />
                </ContenedorComentarios>
            </>
        )
    }

    render = () => {
        const { comentarios, telaAdicaoVisivel } = this.state;

        if (comentarios) {
            return(
                <>
                    { this.mostrarComentarios() }
                    { telaAdicaoVisivel && this.mostrarTelaAdicaoComentario() }
                </>);
        } else {
            return null;
        }
    }

}


