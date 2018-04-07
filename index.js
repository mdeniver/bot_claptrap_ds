const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
const links = require("./links.json");

client.on("message", async message => {
    //ignora mensagens comuns evitando loop
    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;

    //separa os mensagens
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    //cria o comando em minusculas
    const command = args.shift().toLowerCase();

//Mensagens de links e textos
    responseObject = links;
    if(responseObject[message.content]){
        message.channel.send(responseObject[message.content]);
    }

//comando para kick
    if(command === "kick") {
        //verifica o nivel da role
        if(!message.member.roles.some(r=>["Admin", "Moderador"].includes(r.name)) )
          return message.reply("Você não tem permissão para usar este comando!");
        
        //consulta se o user existe
        // message.mentions.members representa os users mencionados
        let member = message.mentions.members.first();
        if(!member)
          return message.reply("Plz, Informe um usuário válido");
        if(!member.kickable) 
          return message.reply("Você não possui permissões suficientes para kickar este usuário.");
        
        //slice(1) remove a primeira parte (nome do usuário) 
        let reason = args.slice(1).join(' ');
        if(!reason)
          return message.reply("Qual o motivo do Kick?");
        
        //Executa o kick!
        await member.kick(reason)
          .catch(error => message.reply(`Sry ${message.author} , impossivel executar o kick devido ao erro: ${error}`));
        message.reply(`${member.user.tag} Foi Kickado por ${message.author.tag} .Motivo: ${reason}`);    
      }

//comando para ban      
      if(command === "ban") {
        //Comando igual ao kick, porém apenas para admins
        if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
          return message.reply("Você não tem permissão para usar este comando!");
        
        let member = message.mentions.members.first();
        if(!member)
          return message.reply("Plz, Informe um usuário válido");
        if(!member.bannable) 
          return message.reply("Você não possui permissões suficientes para Banir este usuário.");
    
        let reason = args.slice(1).join(' ');
        if(!reason)
          return message.reply("Qual o motivo do Ban?");
        
        await member.ban(reason)
          .catch(error => message.reply(`Sry ${message.author} , impossivel executar o kick devido ao erro: ${error}`));
        message.reply(`${member.user.tag} Foi Banido por ${message.author.tag} .Motivo: ${reason}`);
      }

//Limpar mensagens      
      if(command === "clean") {
        //define a quantidade como numeros
        const deleteCount = parseInt(args[0], 10);

        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Plz insira um número entre 2 e 100 para deletar");
        
        //deleta
        const fetched = await message.channel.fetchMessages({count: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Erro ao deletar as mensagens: ${error}`));
      }      

});

client.login(config.token);