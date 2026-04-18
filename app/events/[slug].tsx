import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";

import {
    EventDetailsHero,
    EventDescription,
    TicketsSection,
    TicketPurchaseModal,
    OrganizerSection,
    ShareSection,
    SimilarEventsSection,
    EventNotFound,
    AppText,
    Animation,
} from "@/components";
import VenueSection from "@/components/events/details/VenueSection";
import { tickets } from "@/assets";
import type { TicketPurchaseModalRef } from "@/components/events/details/TicketPurchaseModal";
import { getEventBySlug } from "@/lib/events";
import { EventDetails, TicketType } from "@/types";
import { useAuth } from "@/context";

const EventDetailsScreen = () => {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { user } = useAuth();
    const modalRef = useRef<TicketPurchaseModalRef>(null);

    const [event, setEvent] = useState<EventDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [shouldOpenPurchaseModal, setShouldOpenPurchaseModal] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) return;

            setIsLoading(true);
            const data = await getEventBySlug(slug);
            setEvent(data);
            setIsLoading(false);
        };

        fetchEvent();
    }, [slug]);

    const handleTicketPurchase = (ticket: TicketType, qty: number) => {
        setSelectedTicket(ticket);
        setQuantity(qty);
        setShouldOpenPurchaseModal(true);
    };

    useEffect(() => {
        if (!shouldOpenPurchaseModal || !selectedTicket) return;

        const frame = requestAnimationFrame(() => {
            modalRef.current?.open();
            setShouldOpenPurchaseModal(false);
        });

        return () => cancelAnimationFrame(frame);
    }, [shouldOpenPurchaseModal, selectedTicket]);

    if (isLoading) {
        return (
            <View className="flex-1 bg-primary justify-center items-center">
                <Animation
                    isVisible={true}
                    path={tickets}
                    style={{ width: 200, height: 200 }}
                />
                <AppText styles="text-sm text-slate-400 mt-4">
                    Loading event details...
                </AppText>
            </View>
        );
    }

    if (!event) {
        return <EventNotFound />;
    }

    return (
        <>
            <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <EventDetailsHero event={event} />
                <EventDescription event={event} />
                <TicketsSection event={event} currentUser={user} onTicketSelect={handleTicketPurchase} />
                <OrganizerSection event={event} />
                <VenueSection event={event} />
                <ShareSection event={event} />
                <SimilarEventsSection event={event} />
            </ScrollView>

            <TicketPurchaseModal
                ref={modalRef}
                ticket={selectedTicket}
                quantity={quantity}
                event={event}
                currentUser={user}
            />
        </>
    );
};

export default EventDetailsScreen;
