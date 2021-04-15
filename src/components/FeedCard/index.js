import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, CardImage, CardContent } from 'react-native-cards';
import Icon from 'react-native-vector-icons/AntDesign';

import {
    Avatar,
    NomeEmpresa,
    NomeProduto,
    DescricaoProduto, 
    EsquerdaDaMesmaLinha, 
    PrecoProduto,
    Likes 
} from '../../assets/styles';
import avatar from "../../assets/imgs/avatar.png";
import produto from "../../assets/imgs/produto.jpg";

export default class FeedCard extends React.Component {

    constructor(props) { 
        super(props);

        this.state = {
            feed: this.props.feed,
            navegador: this.props.navegador
        }
    }

    render = () => {
        const { feed, navegador } = this.state;

        return (
            <TouchableOpacity onPress={
                () => {
                    navegador.navigate("Detalhes", { feedId: feed._id })
                }
            }>
                <Card>
                    <CardImage source={produto}/>
                    <CardContent>
                        <EsquerdaDaMesmaLinha>
                            <Avatar source={avatar}/>
                            <NomeEmpresa>{feed.company.name}</NomeEmpresa>
                        </EsquerdaDaMesmaLinha>
                    </CardContent>
                    <CardContent>
                        <NomeProduto>{feed.product.name}</NomeProduto>
                    </CardContent>
                    <CardContent>
                        <DescricaoProduto>{feed.product.description}</DescricaoProduto>
                    </CardContent>
                    <CardContent>
                        <EsquerdaDaMesmaLinha>
                            <PrecoProduto>{"Estreia: " + feed.product.price}  </PrecoProduto>
                            <Icon name="heart" size={18} color={"#ff0000"}>
                                <Likes> {feed.likes}</Likes>
                            </Icon>
                        </EsquerdaDaMesmaLinha>
                    </CardContent>
                </Card>
            </TouchableOpacity>
        );
    }

}