const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '153192@ids.upchiapas.edu.mx',
        pass: 'tareasuni'
    }
});

exports.sendMail = functions.firestore.document('usuarios/{id}')
    .onCreate((snap, context)=>{
    const datos = snap.data();
    const email = datos.correo;
    const token =  snap.data().token
    console.log("Datos: ",datos);
    console.log("Email: ",email);
    const mailOptions = {
        from: `153192@ids.upchiapas.edu.mx`,
        to: email,
        subject: 'gracias por registrarte',
        html: `<h1> confirma tu cuenta </h1>
                <p>confirmar</p>
                <a href="http://localhost:4200/user/confirm/${token}">Proceda</a>
                `,
    }


    return transporter.sendMail(mailOptions, (error, data)=>{
        if(error){
            console.log(error,"ERROR",mailOptions.to)
            return
        }
        console.log("Sent!")
    });
});

exports.sendMailActualizar = functions.firestore.document('usuarios/{id}')
    .onUpdate((change, context) => {
        const valorAnterior = change.before.data();
        const valorActual = change.after.data();
        const email = valorActual.correo;

        const statusAnterior = valorAnterior.status;
        const statusActual = valorActual.status;

        const passwordAnterior = valorAnterior.password;
        const passwordActual = valorActual.password;

        const codeAnterior = valorAnterior.codigo;
        const codeActual = valorActual.codigo;

        if(statusActual !== statusAnterior){
            const mailOptionsStatus = {
                from: `153192@ids.upchiapas.edu.mx`,
                to: email,
                subject: 'gracias por registrarte',
                html: `<h1> tu cuenta ha sido Activada </h1>
                        `,
            }

            return transporter.sendMail(mailOptionsStatus, (error, data)=>{
                if(error){
                    console.log(error,"ERROR",mailOptionsStatus.to)
                    return
                }
                console.log("Sent!")
            });
            
        } else if(passwordActual !== passwordAnterior){
            const mailOptionsPass = {
                from: `153192@ids.upchiapas.edu.mx`,
                to: email,
                subject: 'nueva contraseña',
                html: `<h1> tu contraseña ha sido actualizada </h1>
                        `,
            }

            return transporter.sendMail(mailOptionsPass, (error, data)=>{
                if(error){
                    console.log(error,"ERROR",mailOptionsPass.to)
                    return
                }
                console.log("Sent!")
            });

        } else if(codeActual !== codeAnterior){
            const mailOptionsAuth = {
                from: `153192@ids.upchiapas.edu.mx`,
                to: email,
                subject: 'autenticacion en 2 pasos',
                html: `<h1>Codigo de autenticacion: ${codeActual}</h1>`,
            }

            return transporter.sendMail(mailOptionsAuth, (error, data)=>{
                if(error){
                    console.log(error,"ERROR",mailOptionsAuth.to)
                    return
                }
                console.log("Sent!")
            });
        }
        else{
            console.log('no se ha actualizado nada relevante');
        }
});
