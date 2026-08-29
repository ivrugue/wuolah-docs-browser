let valores = {
    comunidad_id: null,
    curso: null,
};

const listeners = new Set();

export const state = new Proxy(valores, {
    set(target, propiedad, valor) {
        target[propiedad] = valor;

        listeners.forEach(listener => listener(propiedad, valor));

        return true;
    }
});

export function subscribe(listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}