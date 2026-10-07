import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxAd9aONVUtaMPiyPlrZtEJNserACJySs",
  authDomain: "controle-corridas-90795.firebaseapp.com",
  projectId: "controle-corridas-90795",
  storageBucket: "controle-corridas-90795.firebasestorage.app",
  messagingSenderId: "116752945231",
  appId: "1:116752945231:web:6477f51f338bd780a61a3a",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const usuarioAtual = () => auth.currentUser;
window.obterTokenFirebase = async function () {
  const usuario = auth.currentUser;

  if (!usuario) {
    return null;
  }

  return await usuario.getIdToken();
};

const provider = new GoogleAuthProvider();

// ===== SALVAR RECEITA =====

window.salvarReceitaFirebase = async function (dados) {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");
      return;
    }

    const docRef = await addDoc(
      collection(db, "usuarios", usuario.uid, "receitas"),
      dados,
    );

    console.log("✅ Receita salva");

    return docRef.id;
  } catch (erro) {
    console.error("❌ Erro:", erro);
  }
};
window.salvarConfiguracoesFirebase = async function (dados) {
  try {
    const usuario = usuarioAtual();

    if (!usuario) return;

    await setDoc(
      doc(db, "usuarios", usuario.uid, "configuracoes", "dados"),
      dados,
      { merge: true },
    );

    console.log("✅ Configurações salvas");
  } catch (erro) {
    console.error("❌ Erro ao salvar configurações:", erro);
  }
};

window.carregarConfiguracoesFirebase = async function () {
  try {
    const usuario = usuarioAtual();

    if (!usuario) return null;

    const snap = await getDoc(
      doc(db, "usuarios", usuario.uid, "configuracoes", "dados"),
    );

    if (snap.exists()) {
      return snap.data();
    }

    return null;
  } catch (erro) {
    console.error("❌ Erro ao carregar configurações:", erro);
    return null;
  }
};

// ===== CARREGAR RECEITAS =====

window.editarReceitaFirebase = async function (id, dados) {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");
      return;
    }

    await updateDoc(doc(db, "usuarios", usuario.uid, "receitas", id), dados);

    console.log("✏️ Receita atualizada");
  } catch (erro) {
    console.error(erro);
  }
};

window.excluirReceitaFirebase = async function (id) {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");

      return;
    }

    console.log("🗑️ Excluindo ID:", id);

    await deleteDoc(doc(db, "usuarios", usuario.uid, "receitas", id));

    console.log("✅ Receita excluída");
  } catch (erro) {
    console.error("❌ Erro ao excluir:", erro);
  }
};

window.carregarReceitasFirebase = async function () {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");

      return [];
    }

    const q = query(
      collection(db, "usuarios", usuario.uid, "receitas"),

      orderBy("data", "desc"),
    );

    const consulta = await getDocs(q);

    let receitasFirebase = [];

    consulta.forEach((doc) => {
      receitasFirebase.push({
        id: doc.id,

        ...doc.data(),
      });
    });

    console.log("☁️ Receitas carregadas:", receitasFirebase);

    return receitasFirebase;
  } catch (erro) {
    console.error("❌ Erro:", erro);

    return [];
  }
};
window.escutarReceitasFirebase = function (callback) {
  const usuario = usuarioAtual();

  if (!usuario) {
    console.log("❌ Usuário não logado");
    return;
  }

  const q = query(
    collection(db, "usuarios", usuario.uid, "receitas"),
    orderBy("data", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    let receitasFirebase = [];

    snapshot.forEach((doc) => {
      receitasFirebase.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    callback(receitasFirebase);
  });
};
// ===== GASTOS =====

window.salvarGastoFirebase = async function (dados) {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");

      return;
    }

    const docRef = await addDoc(
      collection(db, "usuarios", usuario.uid, "gastos"),
      dados,
    );

    console.log("✅ Gasto salvo");

    return docRef.id;
  } catch (erro) {
    console.error("❌ Erro ao salvar gasto:", erro);
  }
};

window.editarGastoFirebase = async function (id, dados) {
  try {
    const usuario = usuarioAtual();

    await updateDoc(doc(db, "usuarios", usuario.uid, "gastos", id), dados);

    console.log("✏️ Gasto atualizado");
  } catch (erro) {
    console.error(erro);
  }
};

window.excluirGastoFirebase = async function (id) {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");

      return;
    }

    await deleteDoc(doc(db, "usuarios", usuario.uid, "gastos", id));

    console.log("🗑️ Gasto excluído");
  } catch (erro) {
    console.error(erro);
  }
};

window.escutarGastosFirebase = function (callback) {
  const usuario = usuarioAtual();

  if (!usuario) {
    console.log("❌ Usuário não logado");

    return;
  }

  const q = query(
    collection(db, "usuarios", usuario.uid, "gastos"),

    orderBy("data", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    let gastosFirebase = [];

    snapshot.forEach((doc) => {
      gastosFirebase.push({
        id: doc.id,

        ...doc.data(),
      });
    });

    callback(gastosFirebase);
  });
};

// ===== LOGIN GOOGLE =====

window.loginGoogle = async function () {
  console.log("🔥 clicou login");
  try {
    console.log("🔥 iniciando popup");
    const resultado = await signInWithPopup(auth, provider);

    const usuario = resultado.user;
    await salvarUsuarioFirebase(usuario);
    console.log("✅ Usuário logado:", usuario.displayName);
  } catch (erro) {
    console.error("❌ Erro login:", erro);
  }
};

// ===== LOGOUT =====

window.logoutGoogle = async function () {
  if (unsubscribeReceitas) {
    unsubscribeReceitas();
    unsubscribeReceitas = null;
  }

  if (unsubscribeGastos) {
    unsubscribeGastos();
    unsubscribeGastos = null;
  }

  await signOut(auth);

  console.log("👋 Logout realizado");
};
// ===== OBSERVAR LOGIN =====

onAuthStateChanged(auth, async (usuario) => {
  const nomeUsuario = document.getElementById("nome-usuario");

  const btnLogout = document.getElementById("btn-logout");
  const btnLogoutMobile = document.getElementById("btn-logout-mobile");

  const btnLogin = document.querySelector('button[onclick="loginGoogle()"]');
  const btnLoginMobile = document.getElementById("btn-login-mobile");

  if (usuario) {
    console.log("🔥 Logado:", usuario.displayName);

    if (typeof window.carregarDadosUsuario === "function") {
      window.carregarDadosUsuario();
    } else {
      console.error("carregarDadosUsuario ainda não foi carregada.");
    }

    const config = await window.carregarConfiguracoesFirebase();

    if (config) {
      if (config.metaDiaria !== undefined) {
        metaDiaria = config.metaDiaria;
        localStorage.setItem("metaDiaria", metaDiaria);
      }

      if (config.percentual !== undefined) {
        percentual = config.percentual;
        localStorage.setItem("percentual", percentual);
      }

      atualizar();

      console.log("✅ Configurações carregadas");
    }
    await window.atualizarStatusTeste();

    const acessoLiberado = await window.verificarAcessoUsuario();

    if (!acessoLiberado) {
      trocarTela("assinatura");
      console.log("🔒 Acesso direcionado para assinatura.");
    }

    if (nomeUsuario) {
      nomeUsuario.innerText = `Olá, ${usuario.displayName} 👋`;
    }

    if (btnLogin) {
      btnLogin.style.display = "none";
    }

    if (btnLoginMobile) {
      btnLoginMobile.style.display = "none";
    }

    btnLogout.style.display = "block";
    if (btnLogoutMobile) {
      btnLogoutMobile.style.display = "block";
    }

    const btnAdmin = document.getElementById("btn-admin");

    if (btnAdmin && usuario.email === "antoniojrlinhares@gmail.com") {
      btnAdmin.style.display = "block";
    }
  } else {
    console.log("❌ Não logado");

    if (nomeUsuario) {
      nomeUsuario.innerText = "";
    }
    receitas = [];
    gastos = [];
    atualizar();

    if (btnLogin) {
      btnLogin.style.display = "block";
    }

    if (btnLoginMobile) {
      btnLoginMobile.style.display = "block";
    }
    btnLogout.style.display = "none";

    if (btnLogoutMobile) {
      btnLogoutMobile.style.display = "none";
    }

    const btnAdmin = document.getElementById("btn-admin");

    if (btnAdmin) {
      btnAdmin.style.display = "none";
    }
  }
});
window.migrarReceitas = async function () {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");

      return;
    }

    const receitasAntigas = await getDocs(collection(db, "receitas"));

    const receitasNovas = await getDocs(
      collection(db, "usuarios", usuario.uid, "receitas"),
    );

    const descricoesExistentes = [];

    receitasNovas.forEach((doc) => {
      const dados = doc.data();

      descricoesExistentes.push(dados.descricao + dados.data);
    });

    for (const documento of receitasAntigas.docs) {
      const dados = documento.data();

      const chave = dados.descricao + dados.data;

      if (!descricoesExistentes.includes(chave)) {
        await addDoc(
          collection(db, "usuarios", usuario.uid, "receitas"),
          dados,
        );

        console.log("✅ Migrada:", dados.descricao);
      }
    }

    console.log("🚀 Migração concluída");
  } catch (erro) {
    console.error("❌ Erro migração:", erro);
  }
};
window.salvarUsuarioFirebase = async function (usuario) {
  try {
    const usuarioRef = doc(db, "usuarios", usuario.uid);
    const usuarioExistente = await getDoc(usuarioRef);

    const dadosAtuais = usuarioExistente.exists()
      ? usuarioExistente.data()
      : {};

    const dadosUsuario = {
      nome: usuario.displayName,
      email: usuario.email,
      foto: usuario.photoURL,
      plano: dadosAtuais.plano || "gratis",
      ultimoAcesso: serverTimestamp(),
    };

    if (!dadosAtuais.dataCadastro) {
      dadosUsuario.dataCadastro = serverTimestamp();
    }

    if (!dadosAtuais.inicioTeste) {
      dadosUsuario.inicioTeste = serverTimestamp();
    }

    await setDoc(usuarioRef, dadosUsuario, { merge: true });

    console.log("✅ Usuário registrado");
  } catch (erro) {
    console.error("❌ Erro ao salvar usuário:", erro);
  }
};
window.verificarTesteGratis = async function () {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      return null;
    }

    const usuarioRef = doc(db, "usuarios", usuario.uid);
    const snapshot = await getDoc(usuarioRef);

    if (!snapshot.exists()) {
      return null;
    }

    const dados = snapshot.data();

    if (!dados.inicioTeste) {
      return null;
    }

    const inicio = dados.inicioTeste.toDate
      ? dados.inicioTeste.toDate()
      : new Date(dados.inicioTeste);

    const agora = new Date();

    const diferencaMs = agora - inicio;
    const diasPassados = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

    const diasRestantes = Math.max(0, 15 - diasPassados);

    return {
      inicioTeste: inicio,
      diasPassados,
      diasRestantes,
      testeAtivo: diasPassados < 15,
    };
  } catch (erro) {
    console.error("❌ Erro ao verificar teste:", erro);
    return null;
  }
};
window.verificarAcessoUsuario = async function () {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      return false;
    }

    const usuarioRef = doc(db, "usuarios", usuario.uid);
    const snapshot = await getDoc(usuarioRef);

    if (!snapshot.exists()) {
      return false;
    }

    const dados = snapshot.data();

    if (dados.plano === "premium") {
      return true;
    }

    const teste = await window.verificarTesteGratis();

    return teste ? teste.testeAtivo : false;
  } catch (erro) {
    console.error("❌ Erro ao verificar acesso:", erro);
    return false;
  }
};
window.listarUsuariosFirebase = async function () {
  try {
    const snapshot = await getDocs(collection(db, "usuarios"));

    const usuarios = [];

    snapshot.forEach((doc) => {
      usuarios.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Usuários:", usuarios);

    return usuarios;
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
  }
};
window.totalUsuariosFirebase = async function () {
  try {
    const snapshot = await getDocs(collection(db, "usuarios"));

    console.log("👥 Total de usuários:", snapshot.size);

    return snapshot.size;
  } catch (erro) {
    console.error("❌ Erro:", erro);
  }
};
// =====================================================
// TOKEN FIREBASE PARA O CLOUDFLARE WORKER
// =====================================================

window.obterTokenFirebase = async function () {
  const usuario = usuarioAtual();

  if (!usuario) {
    throw new Error("Usuário não está logado.");
  }

  return await usuario.getIdToken();
};
console.log("🔥 Firestore conectado");
