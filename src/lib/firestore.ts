import { db } from "./firebase";
import { collection, addDoc, updateDoc, doc, deleteDoc, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { Application } from "./types";
import { differenceInDays, isPast, isToday } from "date-fns";

const COLLECTION = "applications";

export const fromFirestore = (doc: any): Application => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        dateApplied: data.dateApplied?.toDate() || new Date(),
        lastUpdate: data.lastUpdate?.toDate() || new Date(),
        nextActionDate: data.nextActionDate?.toDate() || null,
    } as Application;
};

export const calculateMetrics = (app: Application) => {
    const now = new Date();
    const daysSinceApplied = differenceInDays(now, app.dateApplied);
    const daysSinceUpdate = app.lastUpdate ? differenceInDays(now, app.lastUpdate) : 0;

    let isFollowUpDue = false;
    if (app.nextActionDate) {
        isFollowUpDue = isPast(app.nextActionDate) || isToday(app.nextActionDate);
    }

    if (["Rejected", "Offer accepted", "Offer declined", "On hold"].includes(app.status)) {
        isFollowUpDue = false;
    }

    return { daysSinceApplied, daysSinceUpdate, isFollowUpDue };
};

const deriveStage = (status: string): string => {
    if (status === "To apply") return "Prospecting";
    if (status === "Applied") return "Applied";
    if (["Screening", "Interview", "Technical test", "Final interview"].includes(status)) return "In process";
    if (status === "Offer") return "Offer stage";
    return "Closed";
};

export const createApplication = async (userId: string, data: Partial<Application>) => {
    const status = data.status || "To apply";
    const payload = {
        ...data,
        userId,
        status,
        stage: data.stage || deriveStage(status),
        createdAt: Timestamp.now(),
        lastUpdate: Timestamp.now(),
        dateApplied: data.dateApplied ? Timestamp.fromDate(new Date(data.dateApplied)) : Timestamp.now(),
        nextActionDate: data.nextActionDate ? Timestamp.fromDate(new Date(data.nextActionDate)) : null,
    };
    // Remove undefined values to avoid Firestore errors
    Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);

    await addDoc(collection(db, COLLECTION), payload);
};

export const updateApplication = async (id: string, data: Partial<Application>) => {
    const payload: any = {
        ...data,
        lastUpdate: Timestamp.now(),
    };

    if (data.status) {
        payload.stage = data.stage || deriveStage(data.status);
    }

    if (data.dateApplied) {
        payload.dateApplied = Timestamp.fromDate(new Date(data.dateApplied));
    }

    if (data.nextActionDate !== undefined) {
        payload.nextActionDate = data.nextActionDate ? Timestamp.fromDate(new Date(data.nextActionDate)) : null;
    }

    // Remove undefined values
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, payload);
};

export const deleteApplication = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
};

export const getUserApplications = async (userId: string) => {
    // We remove the 'orderBy' to avoid requiring a composite index immediately.
    // This allows the app to work even if the user hasn't configured the index yet.
    const q = query(collection(db, COLLECTION), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const apps = snapshot.docs.map(fromFirestore);

    // Sort in memory by dateApplied descending (most recent first)
    return apps.sort((a, b) => b.dateApplied.getTime() - a.dateApplied.getTime());
};
