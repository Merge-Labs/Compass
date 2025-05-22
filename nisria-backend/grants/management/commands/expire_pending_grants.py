from django.core.management.base import BaseCommand
from django.utils import timezone
from grants.models import Grant # Assuming your Grant model is in grants.models

class Command(BaseCommand):
    help = (
        "Updates the status of pending grants to 'expired' if their "
        "application deadline has passed and their status is 'pending'."
    )

    def handle(self, *args, **options):
        today = timezone.now().date()

        # Find grants that are:
        # 1. Status is 'pending'
        # 2. Application deadline is not null
        # 3. Application deadline is in the past
        grants_to_expire = Grant.objects.filter(
            status='pending',
            application_deadline__isnull=False,
            application_deadline__lt=today
        )

        updated_count = 0
        for grant in grants_to_expire:
            grant.status = 'expired'
            grant.save(update_fields=['status']) # Efficiently update only the status field
            updated_count += 1
            self.stdout.write(self.style.SUCCESS(f'Grant ID {grant.id} ("{grant.organization_name}") status updated to expired.'))

        if updated_count > 0:
            self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} grants to "expired".'))
        else:
            self.stdout.write(self.style.NOTICE('No pending grants found that met the expiration criteria.'))