// mui
import {Card, Skeleton, CardHeader, CardContent} from '@mui/material';

export default function SkeletionCard() {
    return (
        <Card>
            <CardHeader>
                <Skeleton variant="text" height={240} />
            </CardHeader>
            <CardContent>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={40} />
            </CardContent>
        </Card>
    )
}