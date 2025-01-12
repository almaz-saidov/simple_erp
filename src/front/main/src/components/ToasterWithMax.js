import React, { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

function useMaxToasts(max) {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= max)
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts, max]);
}

export function ToasterWithMax(props) {
    const { max = 1, ...restProps } = props;
    useMaxToasts(max);

    return <Toaster {...restProps} />;
}
