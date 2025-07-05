
export const errorHandler = (
    err: { status: any; message: any; },
    req: any,
    res: any,
    next: any
) => {
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
};
