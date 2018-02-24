var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

   onDeviceReady: function() {
        this.esperaCarregar();
    },
    
    /**
     * Função que inicia o conteudo e aparece as demandas na tela
     * @return void
     */
    esperaCarregar: function() {
        //carregando lista de demandas
        $.ajax({
            url: "http://localhost/appavaliacao",
            type: "get",
            data: "metodo=lista_demandas&id_demanda=100&hash_id_avaliador=6b95942fd6f39272c5d98b9333b1fcdb",
            dataType: "json",
            crossDomain:true,
            success: function(data, status) {
                console.log(data[0].avaliacoes);
                for (var i =0;i<data.length;i++) {
                    criarLinha(data[i].id_demanda, 
                    data[i].descricao_demanda, 
                    data[i].pessoas,
                    data[i].avaliacoes);
                }
            },
            error: function(jqXHR,textStatus,errorThrown) {
                alert(errorThrown)
            }
        });
    }
};

/**
 * função para criar as linhas para analisar cada proposta
 * @param integer id
 * @param string descricao
 * @param integer pessoas
 * @param integer avaliacoes
 * @returns {undefined}
 */
function criarLinha(id,descricao,pessoas,avaliacoes) {
    $("#app").html(
                        "<div id='"+id+"' onclick='abrelistaavaliacao("+id+",\""+pessoas.join(",")+"\",\""+avaliacoes.join(",")+"\")'>"+
                        "<div class='caixinha um'>"+descricao+"</div>" +
                        "<div class='dois caixinha'><div class='tit'>Pessoas</div>"+ pessoas.length +"</div>"+
                        "<div class='dois caixinha'><div class='tit'>Avaliados</div>"+ avaliacoes.length +"</div>" + 
                        "</div>"
                );
}

function abrelistaavaliacao(id_demanda,pessoas,avaliacoes) {
    var p = pessoas.split(",");
    var d = avaliacoes.split(",");
    var pn = new Array();
    $("#app").html("");
    for(var i=0; i<p.length; i++) {
        pn = p[i].split(":");
        $("#app").append("<div onclick='abreavalicao("+pn[0]+",\"" + p[1] + "\","+id_demanda+")'>"+ pn[0] +" - "+ pn[1] +"</div>");
    }
}

/**
 * Abre avaliação para iniciar a avaliação
 * @param {type} pessoa
 * @param {type} nome
 * @param {type} demanda
 * @returns {undefined}
 */
function abreavalicao(pessoa, nome,demanda) {
    $("#app").html("carregando...");
    $.ajax({
        url: "http://localhost/appavaliacao",
            type: "get",
            data: "metodo=visualizar_avaliacoes&id_demanda="+demanda,
            dataType: "json",
            success: function(data, status) {
                console.log(data);
                
                $("#app").html("Nome: "+nome);
                for (var i=0;i<data.length;i++) {
                    $("#app").append("<br>"+constroiinput(demanda,'asas')+" - Asas ao Crescimento");
                    $("#app").append("<br>"+constroiinput(demanda,'fala')+" - Fala o que faz");
                    $("#app").append("<br>"+constroiinput(demanda,'garra')+" - Garra fala mais alto");
                    $("#app").append("<br>"+constroiinput(demanda,'inquietacao')+" - Inquietação: ");
                    $("#app").append("<br>"+constroiinput(demanda,'relacao')+" - Relacionamento");
                    $("#app").append("<br>"+constroiinput(demanda,'performance')+" - Performance");
                    $("#app").append("<br>"+constroiinput(demanda,'protagonista')+" - Protagonismo");
                    $("#app").append("<br>Feedback:<br><textarea></textarea>");
                }
                $("#app").append("<br><button onclick='avaliar("+pessoa+","+demanda+")'>Avaliar</button>");
                
                
            }
    });
}

/**
 * Função que insere os dados de avaliação
 * @param Integer pessoa
 * @param Integer demanda
 * @returns {undefined}
 */
function avaliar(pessoa,demanda) {
    $.ajax({
        url: "http://localhost/appavaliacao",
        type: "get",
        data: "metodo=insere_avaliacao"+
                "&id_avaliado=" + pessoa +
                "&hash_id_avaliador=6b95942fd6f39272c5d98b9333b1fcdb" + 
                "&id_demanda=" + demanda +
                pegaavalicao() +
                "&feedback=" + encodeURI($("textarea").val()) 
                ,
        dataType: "json",
        success: function(data,status) {
            if (data.avaliado==true) {
                alert("Dados computados");
                app.esperaCarregar();
            } else {
                alert(data.erro);   
            }
        }
    });
}

/**
 * pega dados da avaliação para muntagem
 * @returns {String}
 */
function pegaavalicao() {
    var qs = $("select").length;
    var ret = "";
    for (var i = 0; i<qs; i++) {
        ret += "&"+$("select")[i].id + "="+$("select")[i].value;
    }
    return ret;
}

/**
 * Constroi os menus para avaliação
 * @returns {String}
 */
function constroiinput(dif, nome) {
    var html = "<select "+dif+" id='"+nome+"'>";
    for (var i=0; i<=10; i++) {
        html += "<option>"+i+"</option>";
    }
    html += "</select>";
    return html;
}

app.initialize();