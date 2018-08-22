use MooseX::Declare;

=head2

	PRINT FILE TO CLIENT FOR DOWNLOAD

=cut

use strict;
use warnings;
use Carp;

class Web::Transport::Download with (Web::Base,
	Table::Main,
	Agua::Common::History,
	Util::Logger,
	Web::Group::Privileges,
	Web::Transport,
	Util
)
{
#### EXTERNAL MODULES
use Data::Dumper;
use FindBin::Real;
use lib FindBin::Real::Bin() . "/lib";

#### INTERNAL MODULES	
use Web::JSON;

# Integers
has 'log'		=>  ( isa => 'Int', is => 'rw', default => 1 );  
has 'printlog'		=>  ( isa => 'Int', is => 'rw', default => 5 );
has 'validated'		=> ( isa => 'Int', is => 'rw', default => 0 );

# Strings
has 'input'			=> ( isa => 'Str|Undef', is => 'rw', default => '' );
has 'fileroot'		=> ( isa => 'Str|Undef', is => 'rw', default => '' );
has 'username'  	=>  ( isa => 'Str', is => 'rw' );
has 'workflow'  	=>  ( isa => 'Str', is => 'rw' );
has 'project'   	=>  ( isa => 'Str', is => 'rw' );
has 'outputdir'		=>  ( isa => 'Str', is => 'rw' );

# Objects
has 'jsonparser'	=> ( isa => 'JSON', is => 'rw', lazy => 1, builder => "setJsonParser" );
has 'json'			=> ( isa => 'HashRef', is => 'rw', required => 0 );
has 'db'		=> ( isa => 'DBase::MySQL', is => 'rw', required => 0 );
has 'conf' 	=> (
	is =>	'rw',
	isa => 'Conf::Yaml',
	default	=>	sub { Conf::Yaml->new( {} );	}
);

####////}}}

method BUILD ($hash) {
	$self->logDebug("");
	$self->initialise();
}

method initialise {
	$self->logDebug("");
	my $input = $self->input();

	my $jsonConverter = Web::JSON->new();
	my $json = $jsonConverter->cgiToJson($input);
	print "Content-type: text/xml\n\n{ error: 'download.pl    json not defined' }\n" and exit if not defined $json;
	$self->json($json);
	$self->logDebug("json", $json);

	#### IF JSON IS DEFINED, ADD VALUES TO SLOTS
	if ( $json )
	{
		foreach my $key ( keys %{$json} ) {
			$json->{$key} = $self->unTaint($json->{$key});
			$self->$key($json->{$key}) if $self->can($key);
		}
	}
	$self->logDebug("json", $json);
	my $username = $self->username();
	$self->logDebug("username", $username);
	
	#### SET DATABASE HANDLE
	$self->setDbh();
	
	my $outfile = "/tmp/download-initialise.out";
	open(OUT, ">$outfile") or die "Can't open outfile: $outfile\n";
	print OUT "input: $input";
	$self->logDebug("input", $input);
	close(OUT) or die "Can't close outfile: $outfile\n";
   
	#### VALIDATE
    $self->logError("User session not validated for username: $username") and exit unless $self->validate();
}



}

1;
