import api from "./api";

const PAGE_SIZE = 20;

export const getCatalogoEventos = async ({ filtro, tipo, page = 1, limit = PAGE_SIZE } = {}) => {
    const params = { page, limit };

    if (filtro) {
        params.filtro = filtro;
    }

    if (tipo) {
        params.tipo = tipo;
    }

    const response = await api.get("/api/v1/catalogo/eventos", { params });
    return response.data;
};

export const getTiposEvento = async () => {
    const response = await api.get("/api/v1/tipos-evento");
    return response.data;
};
